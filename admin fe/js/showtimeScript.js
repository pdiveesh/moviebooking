document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("showtime-form");
    const showtimeTable = document.getElementById("showtime-table").querySelector("tbody");
    const apiUrl = "http://localhost:8080/api/showtimes/all"; // Updated endpoint

    // Fetch and display existing showtimes
    fetchShowtimes();

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const showtimeData = {
            ticketPrice: parseFloat(document.getElementById("ticketPrice").value),
            startDate: document.getElementById("startDate").value,
            endDate: document.getElementById("endDate").value,
            movieId: document.getElementById("movieId").value,
            theatreId: document.getElementById("theatreId").value,
            times: document.getElementById("showtimes").value.split(',').map(time => time.trim())
        };

        // Post the new showtime
        fetch(apiUrl.replace("/all", ""), { // Adjust URL to post without `/all`
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(showtimeData)
        })
        .then(response => response.json())
        .then(() => {
            // Clear the form and refresh the table
            form.reset();
            fetchShowtimes();
        })
        .catch(error => console.error("Error:", error));
    });

    // Fetch showtimes from the server and populate the table
    function fetchShowtimes() {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(showtimes => {
                showtimeTable.innerHTML = ""; // Clear existing rows
                showtimes.forEach(showtime => {
                    const row = document.createElement("tr");
    
                    // Format the dates
                    const startDate = new Date(showtime.startDate).toLocaleDateString();
                    const endDate = new Date(showtime.endDate).toLocaleDateString();
    
                    row.innerHTML = `
                        <td>${showtime.id}</td>
                        <td>${showtime.ticketPrice}</td>
                        <td>${startDate}</td>
                        <td>${endDate}</td>
                        <td>${showtime.movieId}</td>
                        <td>${showtime.theatreId}</td>
                        <td>${showtime.times.join(', ')}</td>
                        <td>
                            <button class="delete-btn" data-id="${showtime.id}">Delete</button>
                        </td>
                    `;
    
                    showtimeTable.appendChild(row);
                });
    
                // Add delete functionality to each delete button
                document.querySelectorAll(".delete-btn").forEach(button => {
                    button.addEventListener("click", (event) => {
                        const id = event.target.getAttribute("data-id");
                        deleteShowtime(id);
                    });
                });
            })
            .catch(error => console.error("Error:", error));
    }
    
    // Delete a showtime by ID
    function deleteShowtime(id) {
        fetch(`${apiUrl.replace("/all", "")}/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            fetchShowtimes();
        })
        .catch(error => console.error("Error:", error));
    }
});
