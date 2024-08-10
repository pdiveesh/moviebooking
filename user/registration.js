document.querySelector('.registration-form form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.querySelector('input[placeholder="Username"]').value;
    const mobileNumber = document.querySelector('input[placeholder="Mobile Number"]').value;
    const email = document.querySelector('input[placeholder="Email"]').value;
    const password = document.querySelector('input[placeholder="Password"]').value;
    const confirmPassword = document.querySelector('input[placeholder="Confirm Password"]').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const user = {
        username: username,
        mobileNumber: mobileNumber,
        email: email,
        password: password
    };

    fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        if (data.includes("User registered successfully")) {
            window.location.href = "./login.html"; // Redirect to login page
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to register user.');
    });
});
