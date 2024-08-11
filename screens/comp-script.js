document.addEventListener('DOMContentLoaded', function () {
    // Function to get query parameter by name
    function getQueryParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    // Get the movie ID from the URL query parameters
    const movieId = getQueryParam('id'); // e.g., http://localhost:5500/movie.html?id=66accfa51f1c1e471da15511

    if (!movieId) {
        console.error('No movie ID provided in URL');
        return;
    }

    // Use the correct backend URL here
    const apiUrl = `http://localhost:8080/api/movies/${movieId}`; // Adjust the port if needed

    // Fetch movie data from backend
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(movie => {
            // Check if movie data is received
            console.log('Movie data:', movie);

            // Inject the movie data into the HTML
            document.getElementById('movie-poster').src = movie.image;
            document.getElementById('movie-title').textContent = movie.title;
            document.getElementById('movie-director').textContent = movie.director;
            document.getElementById('movie-language').textContent = movie.language;
            document.getElementById('movie-genre').textContent = movie.genre;
            document.getElementById('movie-duration').textContent = `${movie.duration} minutes`;
            document.getElementById('movie-description').textContent = movie.description;
        })
        .catch(error => console.error('Error fetching movie data:', error));
});
document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username');
    if (username) {
        document.querySelector('.nav-link.name').innerText = `Hey, ${username}`;
    }
});