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
            document.querySelector('.theatre-image').src = movie.image || '../POSTERS/default-movie.jpg';
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
            const datesContainer = document.querySelector('.show-dates');
            const timingsContainer = document.querySelector('.show-timings');
            const dates = new Set();
            const showtimesByDate = {};

            showtimes.forEach(showtime => {
                const startDate = new Date(showtime.startDate);
                const endDate = new Date(showtime.endDate);

                for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
                    const formattedDate = formatDate(d);
                    if (!dates.has(formattedDate)) {
                        dates.add(formattedDate);
                        showtimesByDate[formattedDate] = showtimes.filter(st => formatDate(new Date(st.startDate)) === formattedDate);
                    }
                }
            });

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
                    const showtimesForDate = showtimesByDate[date] || [];

                    timingsContainer.innerHTML = '';
                    if (showtimesForDate.length > 0) {
                        showtimesForDate.forEach(showtime => {
                            showtime.times.forEach(time => {
                                const timeBox = `
                                    <div class="show-time-box">
                                        <p class="show-time">${time}</p>
                                    </div>
                                `;
                                timingsContainer.insertAdjacentHTML('beforeend', timeBox);
                            });
                        });
                    } else {
                        timingsContainer.innerHTML = '<p>No showtimes available</p>';
                    }
                });
            });
        })
        .catch(error => console.error('Error fetching showtimes data:', error));
});
