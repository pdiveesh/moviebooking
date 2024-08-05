const placeholders = [
    "What's Your Movie Mood?",
    "Find Your Next Blockbuster",
    "Search Movies, Cinemas, and More",
    "Ready for a Movie Adventure?",
    "Discover Your Next Favorite Film"
];
let currentIndex = 0;

function changePlaceholder() {
    const searchInput = document.getElementById('searchInput');
    searchInput.placeholder = placeholders[currentIndex];
    currentIndex = (currentIndex + 1) % placeholders.length;
}

setInterval(changePlaceholder, 3000); // Change every 3 seconds

const carouselTrack = document.querySelector('.carousel-track');
const images = Array.from(carouselTrack.querySelectorAll('img'));
const imageWidth = images[0].offsetWidth + parseFloat(getComputedStyle(images[0]).marginRight);
const totalWidth = imageWidth * images.length;
const animationDuration = 30000; // Duration for one complete scroll in milliseconds

// Set the width of carousel-track to accommodate duplicate images
carouselTrack.style.width = `${totalWidth * 2}px`;

function setAnimationDuration() {
    carouselTrack.style.animationDuration = `${animationDuration}ms`;
}

setAnimationDuration();
