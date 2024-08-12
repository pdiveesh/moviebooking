document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username');
    if (username) {
        document.querySelector('.nav-link.name').innerText = `Hey, ${username}`;
    }
    
    // Fetch and display cities
    loadCities();
});

function setCity(city) {
    localStorage.setItem('selectedCity', city);
}

function getRandomIcon() {
    const icons = [
        'fa-city',
        'fa-building',
        'fa-home',
        'fa-store',
        'fa-shop',
        'fa-theater-masks',
        'fa-hotel',
        'fa-university',
        'fa-bus',
        'fa-train'
    ];
    const randomIndex = Math.floor(Math.random() * icons.length);
    return icons[randomIndex];
}

function loadCities() {
    fetch('http://localhost:8080/api/cities') // Adjust the URL as needed
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(cities => {
            const citiesContainer = document.getElementById('citiesContainer');
            citiesContainer.innerHTML = '';

            cities.forEach(city => {
                const cityElement = document.createElement('div');
                cityElement.className = 'col-12 col-md-3 blk';
                cityElement.innerHTML = `
                    <a href="./main.html" onclick="setCity('${city.name}')">
                        <div class="icon-container">
                            <i class="fas ${getRandomIcon()}"></i>
                        </div>
                        <h2 class="loc-h">${city.name.toUpperCase()}</h2>
                    </a>
                `;
                citiesContainer.appendChild(cityElement);
            });
        })
        .catch(error => console.error('Error fetching cities:', error));
}
