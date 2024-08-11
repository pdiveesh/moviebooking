document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username');
    if (username) {
        document.querySelector('.nav-link.name').innerText = `Hey, ${username}`;
    }
});
function setCity(city) {
    localStorage.setItem('selectedCity', city);
  }