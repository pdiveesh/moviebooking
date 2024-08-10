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
    .then(response => response.text())
    .then(data => {
        alert(data);
        if (data.includes("Login successful")) {
            // Redirect to the dashboard or home page after successful login
            window.location.href = "./theatre.html";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to login.');
    });
});
