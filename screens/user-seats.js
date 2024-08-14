document.addEventListener('DOMContentLoaded', function () {
    function getQueryParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    const movieId = getQueryParam('movieId');
    const theatreId = getQueryParam('theatreId');
    const date = getQueryParam('date');
    const time = getQueryParam('time');

    if (!movieId || !theatreId || !date || !time) {
        console.error('Required parameters not provided in URL');
        return;
    }

    const seatApiUrl = `http://localhost:8080/api/seats/by-movie-theatre?movieId=${movieId}&theatreId=${theatreId}`;

    fetch(seatApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(seats => {
            const seatContainer = document.getElementById('seat-container');
            seatContainer.innerHTML = ''; // Clear existing seats

            // Assume `seatNumber` in response data is the total number of seats
            const totalSeats = parseInt(seats[0].seatNumber, 10);

            // Constraints
            const maxRows = 26;
            const rowLengths = [15, 10, 5]; // Example row lengths; adjust as needed

            let currentRow = 0;
            let seatIndex = 0;

            // Generate seat elements
            while (seatIndex < totalSeats) {
                const rowDiv = document.createElement('div');
                rowDiv.className = 'row';

                const seatsInRow = rowLengths[currentRow % rowLengths.length]; // Use pattern for varying row lengths

                for (let col = 0; col < seatsInRow && seatIndex < totalSeats; col++) {
                    const seatId = `${String.fromCharCode(65 + currentRow)}${col + 1}`; // 'A1', 'A2', ..., 'Z100'

                    const seatElement = document.createElement('div');
                    seatElement.className = `seat available`; // Default to available
                    seatElement.dataset.seatId = seatId;
                    seatElement.textContent = seatId;

                    // Add click event to select a seat
                    seatElement.addEventListener('click', function () {
                        if (seatElement.classList.contains('available')) {
                            seatElement.classList.toggle('selected');
                        }
                    });

                    rowDiv.appendChild(seatElement);
                    seatIndex++;
                }

                seatContainer.appendChild(rowDiv);
                currentRow++;
            }
        })
        .catch(error => console.error('Error fetching seat data:', error));

    document.querySelector('.user-panel button').addEventListener('click', function () {
        const selectedSeats = document.querySelectorAll('.seat.selected');
        const bookingStatus = document.getElementById('booking-status');

        if (selectedSeats.length === 0) {
            bookingStatus.textContent = 'No seats selected!';
            return;
        }

        const seatIds = Array.from(selectedSeats).map(seat => seat.dataset.seatId);
        const bookingDetails = {
            movieId: movieId,
            theatreId: theatreId,
            date: date,
            time: time,
            seats: seatIds
        };

        fetch('http://localhost:8080/api/seats/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingDetails)
        })
        .then(response => {
            if (response.ok) {
                selectedSeats.forEach(seat => {
                    seat.classList.remove('selected');
                    seat.classList.add('booked');
                    seat.classList.remove('available');
                });
                bookingStatus.textContent = 'Seats booked successfully!';
            } else {
                console.error('Error booking seats:', response.statusText);
                bookingStatus.textContent = 'Error booking seats.';
            }
        })
        .catch(error => console.error('Error booking seats:', error));
    });
});
