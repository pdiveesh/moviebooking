document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the username from localStorage and update the nav-link
    const username = localStorage.getItem('username');
    if (username) {
        document.querySelector('.nav-link.name').innerText = `Hey, ${username}`;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the city name from localStorage
    const city = localStorage.getItem('selectedCity');
    if (city) {
        document.getElementById('cityNav').innerText = city;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Retrieve the city name from localStorage
    const city = localStorage.getItem('selectedCity');
    if (!city) {
        console.error('No city selected');
        return;
    }

    const apiUrl = `http://localhost:8080/api/movies/city/${encodeURIComponent(city)}`; // Adjust the URL if needed

    // Fetch the list of movies for the selected city
    fetch(apiUrl)
        .then(response => response.json())
        .then(movies => {
            const container = document.getElementById('movies-container');
            container.innerHTML = movies.map(movie => `
                <div class="pop-mov col-6 col-sm-6 col-md-3 col-lg-2">
                    <a href="comp.html?id=${movie.id}">
                        <img src="${movie.image}" alt="${movie.title}" class="pm-1">
                    </a>
                </div>
            `).join('');
        })
        .catch(error => console.error('Error fetching movies:', error));
});
