document.addEventListener('DOMContentLoaded', function() {
    const addCityForm = document.getElementById('addCityForm');
    const cityList = document.getElementById('cityList');

    // Fetch and display existing cities
    function loadCities() {
        fetch('http://localhost:8080/api/cities')
            .then(response => response.json())
            .then(cities => {
                cityList.innerHTML = '';
                cities.forEach(city => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                    listItem.innerHTML = `
                        ${city.name}
                        <button class="btn btn-danger btn-sm" onclick="deleteCity('${city.id}')">Delete</button>
                    `;
                    cityList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error fetching cities:', error));
    }

    // Add new city
    addCityForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const cityName = document.getElementById('cityName').value;

        fetch('http://localhost:8080/api/cities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: cityName })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add city');
            }
            loadCities();
            addCityForm.reset();
        })
        .catch(error => console.error('Error adding city:', error));
    });

    // Delete city
    window.deleteCity = function(id) {
        fetch(`http://localhost:8080/api/cities/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete city');
            }
            loadCities();
        })
        .catch(error => console.error('Error deleting city:', error));
    };

    // Initial load
    loadCities();
});
