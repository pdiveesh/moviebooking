document.addEventListener('DOMContentLoaded', function () {
    function getQueryParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    const movieId = getQueryParam('movieId');
    const theatreId = getQueryParam('theatreId');

    if (!movieId || !theatreId) {
        console.error('Movie ID or Theatre ID not provided in URL');
        return;
    }

    const apiUrlMovie = `http://localhost:8080/api/movies/${movieId}`;
    const apiUrlTheatre = `http://localhost:8080/api/theatres/${theatreId}`;
    const apiUrlShowtimes = `http://localhost:8080/api/showtimes?movieId=${movieId}&theatreId=${theatreId}`;

    fetch(apiUrlMovie)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(movie => {
            const imageElement = document.querySelector('.theatre-image');
            if (imageElement) {
                imageElement.src = movie.image || '../POSTERS/default-movie.jpg';
            } else {
                console.error('Image element not found');
            }
        })
        .catch(error => console.error('Error fetching movie data:', error));

    fetch(apiUrlTheatre)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(theatre => {
            const nameElement = document.querySelector('.theatre-name');
            const addressElement = document.querySelector('.theatre-address');
            if (nameElement) {
                nameElement.textContent = theatre.name || 'No Name';
            } else {
                console.error('Theatre name element not found');
            }
            if (addressElement) {
                addressElement.textContent = theatre.address || 'No Address';
            } else {
                console.error('Theatre address element not found');
            }
        })
        .catch(error => console.error('Error fetching theatre data:', error));

    fetch(apiUrlShowtimes)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(showtimes => {
            if (showtimes.length === 0) {
                console.error('No showtimes available');
                return;
            }

            const startDate = showtimes[0].startDate;
            const endDate = showtimes[0].endDate;
            const times = showtimes[0].times;

            // Extract all dates within the period
            const dates = new Set();
            const currentDate = new Date(startDate);
            const end = new Date(endDate);

            while (currentDate <= end) {
                const formattedDate = formatDate(currentDate.toISOString().split('T')[0]);
                dates.add(formattedDate); // Format as DD-MM-YYYY
                currentDate.setDate(currentDate.getDate() + 1);
            }

            const datesContainer = document.querySelector('.show-dates');
            const timingsContainer = document.querySelector('.show-timings');

            datesContainer.innerHTML = '';
            dates.forEach(date => {
                const dateButton = `
                    <button class="btn btn-outline-primary date-button" data-date="${date}">
                        ${date}
                    </button>
                `;
                datesContainer.insertAdjacentHTML('beforeend', dateButton);
            });

            document.querySelectorAll('.date-button').forEach(button => {
                button.addEventListener('click', function () {
                    const date = this.dataset.date;

                    timingsContainer.innerHTML = '';
                    if (!times || times.length === 0) {
                        timingsContainer.innerHTML = '<p>No showtimes available for this date.</p>';
                        return;
                    }

                    times.forEach(time => {
                        const timeBox = `
                            <div class="show-time-box">
                                <p class="show-time">${time}</p>
                            </div>
                        `;
                        timingsContainer.insertAdjacentHTML('beforeend', timeBox);
                    });
                });
            });
        })
        .catch(error => console.error('Error fetching showtimes data:', error));
});
