// Toggle between login and signup forms
document.getElementById('signup-link').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('.form-inner').classList.add('flipped');
});

document.getElementById('login-link').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('.form-inner').classList.remove('flipped');
});

document.querySelector('#signup-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('full-name').value;
    const mobileNumber = document.getElementById('phone-number').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorElement = document.getElementById('password-error');

    // Clear previous error messages
    errorElement.textContent = '';

    // Check if passwords match
    if (password !== confirmPassword) {
        errorElement.textContent = "Passwords do not match!";
        return;
    }

    // Password validation conditions
    const passwordConditions = [
        /[A-Z]/, // At least one uppercase letter
        /[a-z]/, // At least one lowercase letter
        /[0-9]/, // At least one digit
        /[\W_]/, // At least one special character
        /.{8,20}/ // Length between 8 and 20 characters
    ];

    let isValid = true;
    let errorMessage = "Password must meet the following conditions:\n";

    if (!passwordConditions[0].test(password)) {
        errorMessage += "- At least one uppercase letter\n";
        isValid = false;
    }
    if (!passwordConditions[1].test(password)) {
        errorMessage += "- At least one lowercase letter\n";
        isValid = false;
    }
    if (!passwordConditions[2].test(password)) {
        errorMessage += "- At least one digit\n";
        isValid = false;
    }
    if (!passwordConditions[3].test(password)) {
        errorMessage += "- At least one special character\n";
        isValid = false;
    }
    if (!passwordConditions[4].test(password)) {
        errorMessage += "- Between 8 and 20 characters long\n";
        isValid = false;
    }

    if (!isValid) {
        errorElement.textContent = errorMessage;
        return;
    }

    // Proceed with form submission if all checks pass
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

// Login
document.querySelector('#login-form').addEventListener('submit', function(event) {
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
