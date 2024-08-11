function updateRowInputs() {
    const rows = document.getElementById('rows').value;
    const rowInputsContainer = document.getElementById('row-inputs');
    rowInputsContainer.innerHTML = '';

    for (let i = 0; i < rows; i++) {
        const rowInput = document.createElement('div');
        rowInput.classList.add('row-input');
        rowInput.innerHTML = `
            <label for="row${i+1}">Seats in Row ${String.fromCharCode(65 + i)}:</label>
            <input type="number" id="row${i+1}" value="10" min="1" max="100">
        `;
        rowInputsContainer.appendChild(rowInput);
    }
}

function generateSeats() {
    const rows = document.getElementById('rows').value;
    const seatConfig = [];

    for (let i = 0; i < rows; i++) {
        seatConfig.push({
            row: String.fromCharCode(65 + i), // A, B, C, etc.
            seats: parseInt(document.getElementById(`row${i+1}`).value, 10)
        });
    }

    fetch('http://localhost:8080/api/admin/setSeats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(seatConfig)
    })
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.error('Fetch error:', error));
}

window.onload = updateRowInputs;
