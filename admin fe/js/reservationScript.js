// Fetch Reservations and display them in reservationList div
async function fetchReservations() {
    try {
        const response = await fetch('http://localhost:8080/api/reservations');
        if (!response.ok) throw new Error('Network response was not ok');
        const reservations = await response.json();
        const reservationList = document.getElementById('reservationList');
        reservationList.innerHTML = '';
        reservations.forEach(reservation => {
            const reservationDiv = document.createElement('div');
            reservationDiv.className = 'reservation';
            reservationDiv.innerHTML = `
                <p><strong>Date:</strong> ${reservation.date}</p>
                <p><strong>Start Time:</strong> ${reservation.startAt}</p>
                <p><strong>Seats:</strong> ${reservation.seats}</p>
                <p><strong>Order ID:</strong> ${reservation.orderId}</p>
                <p><strong>Ticket Price:</strong> ${reservation.ticketPrice}</p>
                <p><strong>Total:</strong> ${reservation.total}</p>
                <p><strong>Movie ID:</strong> ${reservation.movieId}</p>
                <p><strong>Theatre ID:</strong> ${reservation.theatreId}</p>
                <p><strong>Customer Name:</strong> ${reservation.name}</p>
                <p><strong>Customer Phone:</strong> ${reservation.phone}</p>
                <button onclick="editReservation('${reservation.id}')">Edit</button>
                <button onclick="deleteReservation('${reservation.id}')">Delete</button>
            `;
            reservationList.appendChild(reservationDiv);
        });
    } catch (error) {
        console.error('Error fetching reservations:', error);
    }
}

// Add Event Listener to the reservation form
document.getElementById('reservationForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const reservationData = Object.fromEntries(formData.entries());
    const reservationId = document.getElementById('reservationId').value;

    try {
        const method = reservationId ? 'PUT' : 'POST';
        const url = reservationId 
            ? `http://localhost:8080/api/reservations/${reservationId}` 
            : 'http://localhost:8080/api/reservations';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservationData)
        });
        if (response.ok) {
            fetchReservations();
            e.target.reset();
            document.getElementById('reservationId').value = '';
        } else {
            console.error('Error saving reservation:', response.statusText);
        }
    } catch (error) {
        console.error('Error saving reservation:', error);
    }
});

// Edit Reservation
async function editReservation(id) {
    try {
        const response = await fetch(`http://localhost:8080/api/reservations/${id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const reservation = await response.json();
        document.getElementById('reservationId').value = reservation.id;
        document.getElementById('date').value = reservation.date;
        document.getElementById('startAt').value = reservation.startAt;
        document.getElementById('seats').value = reservation.seats;
        document.getElementById('orderId').value = reservation.orderId;
        document.getElementById('ticketPrice').value = reservation.ticketPrice;
        document.getElementById('total').value = reservation.total;
        document.getElementById('movieId').value = reservation.movieId;
        document.getElementById('theatreId').value = reservation.theatreId;
        document.getElementById('name').value = reservation.name;
        document.getElementById('phone').value = reservation.phone;
    } catch (error) {
        console.error('Error fetching reservation details:', error);
    }
}

// Delete a Reservation
async function deleteReservation(id) {
    try {
        const response = await fetch(`http://localhost:8080/api/reservations/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Network response was not ok');
        fetchReservations();
    } catch (error) {
        console.error('Error deleting reservation:', error);
    }
}

// Initialize
fetchReservations();
