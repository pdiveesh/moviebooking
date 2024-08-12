document.addEventListener('DOMContentLoaded', function() {
    // Populate the city dropdown when the page loads
    fetchCities();
    
    // Add form submission event listener
    document.getElementById('theatre-form').addEventListener('submit', function(event) {
        event.preventDefault();
        handleFormSubmit();
    });

    // Load existing theatres into the table
    loadTheatres();
});

// Fetch cities and populate the dropdown
function fetchCities() {
    fetch('http://127.0.0.1:8080/api/cities') // Adjust URL as necessary
        .then(response => response.json())
        .then(data => {
            const citySelect = document.getElementById('city');
            data.forEach(city => {
                const option = document.createElement('option');
                option.value = city.name;  // or city.id if you use IDs
                option.textContent = city.name;
                citySelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching cities:', error));
}

// Handle form submission to add or update a theatre
function handleFormSubmit() {
    const theatreId = document.getElementById('theatre-id').value;
    const theatre = {
        name: document.getElementById('name').value,
        city: document.getElementById('city').value,
        ticketPrice: parseFloat(document.getElementById('ticketPrice').value),
        seats: parseInt(document.getElementById('seats').value),
        image: ''  // Add image URL or leave as empty if not used
    };

    let method = 'POST';
    let url = 'http://127.0.0.1:8080/api/theatres';
    
    if (theatreId) {
        method = 'PUT';
        url += `/${theatreId}`;
    }

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(theatre)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Theatre added/updated:', data);
        loadTheatres();  // Reload the theatres table
        resetForm();  // Clear the form fields
    })
    .catch(error => console.error('Error adding/updating theatre:', error));
}

// Load existing theatres into the table
function loadTheatres() {
    fetch('http://127.0.0.1:8080/api/theatres') // Adjust URL as necessary
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#theatre-table tbody');
            tableBody.innerHTML = ''; // Clear existing rows
            
            data.forEach(theatre => {
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
        })
        .catch(error => console.error('Error loading theatres:', error));
}

// Edit a theatre
function editTheatre(id) {
    fetch(`http://127.0.0.1:8080/api/theatres/${id}`) // Adjust URL as necessary
        .then(response => response.json())
        .then(data => {
            document.getElementById('theatre-id').value = data.id;
            document.getElementById('name').value = data.name;
            document.getElementById('city').value = data.city;
            document.getElementById('ticketPrice').value = data.ticketPrice;
            document.getElementById('seats').value = data.seats;
        })
        .catch(error => console.error('Error fetching theatre details:', error));
}

// Delete a theatre
function deleteTheatre(id) {
    fetch(`http://127.0.0.1:8080/api/theatres/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        console.log('Theatre deleted:', id);
        loadTheatres(); // Reload the theatres table
    })
    .catch(error => console.error('Error deleting theatre:', error));
}

// Reset form fields
function resetForm() {
    document.getElementById('theatre-form').reset();
    document.getElementById('theatre-id').value = '';
}
