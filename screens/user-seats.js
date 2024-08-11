function loadSeats() {
    fetch('http://localhost:8080/api/user/seats')
        .then(response => response.json())
        .then(seats => {
            console.log('Fetched seats:', seats); // Debugging line
            const seatContainer = document.getElementById('seat-container');
            seatContainer.innerHTML = '';

            // Group seats by row
            const rows = seats.reduce((acc, seat) => {
                if (!acc[seat.row]) acc[seat.row] = [];
                acc[seat.row].push(seat);
                return acc;
            }, {});

            // Create seat rows
            Object.keys(rows).forEach(rowKey => {
                const row = document.createElement('div');
                row.classList.add('seat-row');
                
                rows[rowKey].forEach(seat => {
                    const seatDiv = document.createElement('div');
                    seatDiv.classList.add('seat');
                    seatDiv.dataset.id = seat.id;
                    seatDiv.textContent = `${seat.row}${seat.number}`;
                    if (seat.booked) {
                        seatDiv.classList.add('booked');
                        seatDiv.style.cursor = 'not-allowed'; // Indicate booked seats
                    } else {
                        seatDiv.addEventListener('click', selectSeat);
                    }
                    row.appendChild(seatDiv);
                });
                
                seatContainer.appendChild(row);
            });
        })
        .catch(error => console.error('Error loading seats:', error));
}


function selectSeat(event) {
    const seat = event.target;
    if (!seat.classList.contains('booked')) {
        seat.classList.toggle('selected');
    }
}

function bookSeats() {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const seatData = [];

    selectedSeats.forEach(seat => {
        seatData.push(seat.dataset.id);
    });

    // Replace 'username' with the actual username or retrieve dynamically
    const username = 'username';

    fetch(`http://localhost:8080/api/user/bookSeats?user=${encodeURIComponent(username)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(seatData)
    })
    .then(response => {
        if (response.ok) {
            selectedSeats.forEach(seat => {
                seat.classList.remove('selected');
                seat.classList.add('booked');
            });
            document.getElementById('booking-status').textContent = 'Booking successful!';
        } else {
            document.getElementById('booking-status').textContent = 'Booking failed. Please try again.';
        }
    })
    .catch(error => {
        console.error('Error booking seats:', error);
        document.getElementById('booking-status').textContent = 'Booking failed. Please try again.';
    });
}


window.onload = loadSeats;
