document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('theatre-form');
    const tableBody = document.querySelector('#theatre-table tbody');

    // Fetch theatres and populate the table
    async function fetchTheatres() {
        try {
            const response = await fetch('http://localhost:8080/api/theatres');
            if (!response.ok) throw new Error('Network response was not ok');
            const theatres = await response.json();
            populateTable(theatres);
        } catch (error) {
            console.error('Error fetching theatres:', error);
        }
    }

    function populateTable(theatres) {
        tableBody.innerHTML = ''; // Clear existing rows
        theatres.forEach(theatre => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${theatre.id}</td>
                <td>${theatre.name}</td>
                <td>${theatre.city}</td>
                <td>${theatre.ticketPrice}</td>
                <td>${theatre.seats}</td>
                <td>
                    <button onclick="editTheatre('${theatre.id}')">Edit</button>
                    <button onclick="deleteTheatre('${theatre.id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Add or update theatre
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('theatre-id').value;
        const name = document.getElementById('name').value;
        const city = document.getElementById('city').value;
        const ticketPrice = document.getElementById('ticketPrice').value;
        const seats = document.getElementById('seats').value;

        try {
            const method = id ? 'PUT' : 'POST';
            const url = id ? `http://localhost:8080/api/theatres/${id}` : 'http://localhost:8080/api/theatres';
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, city, ticketPrice, seats })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            await fetchTheatres(); // Refresh the table
            form.reset();
        } catch (error) {
            console.error('Error saving theatre:', error);
        }
    });

    // Edit theatre
    window.editTheatre = (id) => {
        fetch(`http://localhost:8080/api/theatres/${id}`)
            .then(response => response.json())
            .then(theatre => {
                document.getElementById('theatre-id').value = theatre.id;
                document.getElementById('name').value = theatre.name;
                document.getElementById('city').value = theatre.city;
                document.getElementById('ticketPrice').value = theatre.ticketPrice;
                document.getElementById('seats').value = theatre.seats;
            })
            .catch(error => console.error('Error fetching theatre:', error));
    };

    // Delete theatre
    window.deleteTheatre = (id) => {
        fetch(`http://localhost:8080/api/theatres/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return fetchTheatres(); // Refresh the table
        })
        .catch(error => console.error('Error deleting theatre:', error));
    };

    fetchTheatres(); // Initial load
});
