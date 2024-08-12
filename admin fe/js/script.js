document.addEventListener("DOMContentLoaded", () => {
    fetchMovies(); // Fetch movies when the page loads
    fetchCities(); // Fetch the cities when the page loads
});

function fetchMovies() {
    fetch("http://localhost:8080/api/movies")
        .then(response => response.json())
        .then(data => {
            const moviesList = document.getElementById("movies-list");
            moviesList.innerHTML = "";
            data.forEach(movie => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${movie.title}</td>
                    <td>${movie.language}</td>
                    <td>${movie.genre}</td>
                    <td>${movie.director}</td>
                    <td class="actions">
                        <button class="edit" onclick="editMovie('${movie.id}')">Edit</button>
                        <button class="delete" onclick="deleteMovie('${movie.id}')">Delete</button>
                    </td>
                `;
                moviesList.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching movies:", error));
}

function fetchCities() {
    fetch("http://localhost:8080/api/cities")
        .then(response => response.json())
        .then(data => {
            const citySelect = document.getElementById("city");
            citySelect.innerHTML = '<option value="">Select City</option>';
            data.forEach(city => {
                const option = document.createElement("option");
                option.value = city.name;
                option.textContent = city.name;
                citySelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching cities:", error));
}

function fetchTheatresByCity() {
    const cityName = document.getElementById("city").value;
    if (!cityName) {
        document.getElementById("theatre-container").innerHTML = '<label>Theatres:</label>';
        return;
    }
    
    fetch(`http://localhost:8080/api/theatres/city/${encodeURIComponent(cityName)}`)
        .then(response => response.json())
        .then(data => {
            const theatreContainer = document.getElementById("theatre-container");
            theatreContainer.innerHTML = '<label>Theatres:</label>'; // Reset container content
            data.forEach(theatre => {
                const label = document.createElement("label");
                label.innerHTML = `
                    <input type="checkbox" value="${theatre.id}" />
                    ${theatre.name}
                `;
                theatreContainer.appendChild(label);
            });
        })
        .catch(error => console.error("Error fetching theatres:", error));
}

function addOrUpdateMovie() {
    const id = document.getElementById("movie-id").value;
    const selectedTheatres = Array.from(document.querySelectorAll("#theatre-container input[type='checkbox']:checked"))
                                  .map(checkbox => checkbox.value);
    const movie = {
        title: document.getElementById("title").value,
        image: document.getElementById("image").value,
        language: document.getElementById("language").value,
        genre: document.getElementById("genre").value,
        director: document.getElementById("director").value,
        trailer: document.getElementById("trailer").value,
        description: document.getElementById("description").value,
        duration: document.getElementById("duration").value,
        startDate: document.getElementById("start-date").value,
        endDate: document.getElementById("end-date").value,
        cityName: document.getElementById("city").value,
        theatreIds: selectedTheatres // Correct field name for theatre IDs
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `http://localhost:8080/api/movies/${id}` : "http://localhost:8080/api/movies";

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(movie)
    })
    .then(response => response.json())
    .then(() => {
        document.getElementById("movie-form").reset();
        document.getElementById("movie-id").value = "";
        fetchMovies();
    })
    .catch(error => console.error("Error adding/updating movie:", error));
}

function editMovie(id) {
    fetch(`http://localhost:8080/api/movies/${id}`)
        .then(response => response.json())
        .then(movie => {
            document.getElementById("movie-id").value = movie.id;
            document.getElementById("title").value = movie.title;
            document.getElementById("image").value = movie.image;
            document.getElementById("language").value = movie.language;
            document.getElementById("genre").value = movie.genre;
            document.getElementById("director").value = movie.director;
            document.getElementById("trailer").value = movie.trailer;
            document.getElementById("description").value = movie.description;
            document.getElementById("duration").value = movie.duration;
            document.getElementById("start-date").value = movie.startDate;
            document.getElementById("end-date").value = movie.endDate;
            document.getElementById("city").value = movie.cityName;
            fetchTheatresByCity(); // Fetch theatres based on selected city

            // Ensure checkboxes are pre-selected based on movie.theatreIds
            const theatreCheckboxes = document.querySelectorAll("#theatre-container input[type='checkbox']");
            theatreCheckboxes.forEach(checkbox => {
                checkbox.checked = movie.theatreIds.includes(checkbox.value);
            });
        })
        .catch(error => console.error("Error fetching movie:", error));
}

function deleteMovie(id) {
    fetch(`http://localhost:8080/api/movies/${id}`, {
        method: "DELETE"
    })
    .then(() => fetchMovies())
    .catch(error => console.error("Error deleting movie:", error));
}
