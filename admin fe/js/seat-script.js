// Fetch all seats when the page loads
document.addEventListener('DOMContentLoaded', loadSeats);

document.getElementById('seatForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const seatNumber = document.getElementById('seatNumber').value;
    const movieId = document.getElementById('movieId').value;
    const theatreId = document.getElementById('theatreId').value;
    const price = document.getElementById('price').value;

    const seatData = {
        seatNumber,
        movieId,
        theatreId,
        price,
        status: 'available' // default status
    };

    fetch('http://localhost:8080/api/seats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(seatData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        loadSeats(); // Refresh seat list
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function loadSeats() {
    fetch('http://localhost:8080/api/seats')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const seatTableBody = document.getElementById('seatTableBody');
            seatTableBody.innerHTML = '';

            data.forEach(seat => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${seat.seatNumber}</td>
                    <td>${seat.movieId}</td>
                    <td>${seat.theatreId}</td>
                    <td>${seat.price}</td>
                    <td>${seat.status}</td>
                    <td>
                        <input type="text" id="price-${seat.id}" placeholder="New Price"/>
                        <button onclick="updateSeat('${seat.id}')">Update</button>
                        <button onclick="deleteSeat('${seat.id}')">Delete</button>
                    </td>
                `;
                seatTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching seats:', error));
}

function updateSeat(seatId) {
    const newPrice = document.getElementById(`price-${seatId}`).value;

    fetch(`http://localhost:8080/api/seats/update/${seatId}?seatNumber=${encodeURIComponent(seatNumber)}&newPrice=${encodeURIComponent(newPrice)}`, {
        method: 'PUT'
    })
    .then(response => response.json())
    .then(updatedSeat => {
        alert(`Price for seat ${updatedSeat.seatNumber} updated to $${updatedSeat.price}`);
        loadSeats();  // Refresh the seat table after updating a seat
    })
    .catch(error => console.error('Error updating seat:', error));
}

function deleteSeat(seatId) {
    fetch(`http://localhost:8080/api/seats/delete/${seatId}`, {
        method: 'DELETE',
    })
    .then(() => loadSeats())
    .catch((error) => {
        console.error('Error deleting seat:', error);
    });
}
