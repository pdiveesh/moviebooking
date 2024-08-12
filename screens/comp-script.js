document.addEventListener('DOMContentLoaded', function () {
    function getQueryParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    const movieId = getQueryParam('id');

    if (!movieId) {
        console.error('No movie ID provided in URL');
        return;
    }

    const apiUrlMovie = `http://localhost:8080/api/movies/${movieId}`;

    fetch(apiUrlMovie)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(movie => {
            document.getElementById('movie-poster').src = movie.image || 'default-poster.jpg';
            document.getElementById('movie-title').textContent = movie.title || 'No Title';
            document.getElementById('movie-director').textContent = movie.director || 'No Director';
            document.getElementById('movie-language').textContent = movie.language || 'No Language';
            document.getElementById('movie-genre').textContent = movie.genre || 'No Genre';
            document.getElementById('movie-duration').textContent = movie.duration ? `${movie.duration} minutes` : 'No Duration';
            document.getElementById('movie-description').textContent = movie.description || 'No Description';

            // Fetch theatres based on city and movie ID
            const city = localStorage.getItem('selectedCity');
            if (city) {
                document.getElementById('cityNav').innerText = city;

                const apiUrlTheatres = `http://localhost:8080/api/theatres/byCityAndMovie?cityName=${encodeURIComponent(city)}&movieId=${movieId}`;
                fetch(apiUrlTheatres)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json(); // Parse JSON response
                    })
                    .then(theatres => {
                        const theatresContainer = document.querySelector('.theatres .row');
                        theatresContainer.innerHTML = ''; // Clear any existing content

                        if (theatres.length === 0) {
                            theatresContainer.innerHTML = '<p>No theatres found for this movie in the selected city.</p>';
                        } else {
                            theatres.forEach(theatre => {
                                const theatreCard = `
                                    <div class="col-md-4 mb-4">
                                        <div class="card">
                                            <div class="card-body">
                                                <h5 class="card-title">${theatre.name || 'No Name'}</h5>
                                                <p class="card-text">Ticket Price: $${theatre.ticketPrice || 'N/A'}</p>
                                                <p class="card-text">Seats: ${theatre.seats || 'N/A'}</p>
                                                <a href="#" class="btn btn-primary">Book Now</a>
                                            </div>
                                        </div>
                                    </div>
                                `;
                                theatresContainer.insertAdjacentHTML('beforeend', theatreCard);
                            });
                        }
                    })
                    .catch(error => console.error('Error fetching theatres data:', error));
            } else {
                console.error('No city selected');
            }

            const username = localStorage.getItem('username');
            if (username) {
                document.querySelector('.nav-link.name').innerText = `Hey, ${username}`;
            }
        })
        .catch(error => console.error('Error fetching movie data:', error));
});
