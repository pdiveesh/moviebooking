document.querySelector('.login-form form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.querySelector('input[placeholder="Email"]').value;
    const password = document.querySelector('input[placeholder="Password"]').value;

    const user = {
        email: email,
        password: password
    };

    fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) { // Assuming your backend returns a success flag
            localStorage.setItem('username', data.username); // Save username
            window.location.href = "../screens/loc.html"; // Redirect to the post-login page
        } else {
            alert(data.message); // Show an error message
        }
    })
    
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to login.');
    });
});
