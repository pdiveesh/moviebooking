document.addEventListener("DOMContentLoaded", fetchMovies);

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

function addOrUpdateMovie() {
    const id = document.getElementById("movie-id").value;
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
        endDate: document.getElementById("end-date").value
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
        // Clear the form fields and fetch the updated list of movies
        document.getElementById("movie-form").reset();
        document.getElementById("movie-id").value = "";
        fetchMovies(); // Call to update the table
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
        })
        .catch(error => console.error("Error fetching movie:", error));
}

function deleteMovie(id) {
    fetch(`http://localhost:8080/api/movies/${id}`, {
        method: "DELETE"
    })
    .then(() => fetchMovies()) // Call to update the table after deletion
    .catch(error => console.error("Error deleting movie:", error));
}
