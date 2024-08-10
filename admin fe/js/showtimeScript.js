document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('showtime-form');
    const tableBody = document.querySelector('#showtime-table tbody');

    // Fetch showtimes and populate the table
    async function fetchShowtimes() {
        try {
            const response = await fetch('http://localhost:8080/api/showtimes');
            if (!response.ok) throw new Error('Network response was not ok');
            const showtimes = await response.json();
            populateTable(showtimes);
        } catch (error) {
            console.error('Error fetching showtimes:', error);
        }
    }

    function populateTable(showtimes) {
        tableBody.innerHTML = ''; // Clear existing rows
        showtimes.forEach(showtime => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${showtime.id}</td>
                <td>${showtime.ticketPrice}</td>
                <td>${showtime.startDate}</td>
                <td>${showtime.endDate}</td>
                <td>${showtime.movieId}</td>
                <td>${showtime.theatreId}</td>
                <td>
                    <button onclick="editShowtime('${showtime.id}')">Edit</button>
                    <button onclick="deleteShowtime('${showtime.id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Add or update showtime
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('showtime-id').value;
        const ticketPrice = document.getElementById('ticketPrice').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const movieId = document.getElementById('movieId').value;
        const theatreId = document.getElementById('theatreId').value;

        try {
            const method = id ? 'PUT' : 'POST';
            const url = id ? `http://localhost:8080/api/showtimes/${id}` : 'http://localhost:8080/api/showtimes';
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ticketPrice, startDate, endDate, movieId, theatreId })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            await fetchShowtimes(); // Refresh the table
            form.reset();
        } catch (error) {
            console.error('Error saving showtime:', error);
        }
    });

    // Edit showtime
    window.editShowtime = (id) => {
        fetch(`http://localhost:8080/api/showtimes/${id}`)
            .then(response => response.json())
            .then(showtime => {
                document.getElementById('showtime-id').value = showtime.id;
                document.getElementById('ticketPrice').value = showtime.ticketPrice;
                document.getElementById('startDate').value = showtime.startDate;
                document.getElementById('endDate').value = showtime.endDate;
                document.getElementById('movieId').value = showtime.movieId;
                document.getElementById('theatreId').value = showtime.theatreId;
            })
            .catch(error => console.error('Error fetching showtime:', error));
    };

    // Delete showtime
    window.deleteShowtime = (id) => {
        fetch(`http://localhost:8080/api/showtimes/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return fetchShowtimes(); // Refresh the table
        })
        .catch(error => console.error('Error deleting showtime:', error));
    };

    fetchShowtimes(); // Initial load
});
