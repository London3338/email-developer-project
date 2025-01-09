// Add event listener to the form
document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Validate Unicode characters
    if (!isValidUnicode(name) || !isValidUnicode(email) || !isValidUnicode(message)) {
        showNotification('Invalid Unicode characters detected.', 'error');
        return;
    }

    // Prepare data for sending
    const data = {
        name,
        email,
        message
    };

    // Send data to the server
    fetch('/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            addToTable(data.id, new Date().toLocaleString(), name, email, message);
            showNotification('Data sent successfully!', 'success');
            clearForm(); // Clear form fields
        } else {
            showNotification('Failed to send data.', 'error');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        showNotification('An error occurred while sending data.', 'error');
    });
});

// Function to validate Unicode characters
function isValidUnicode(str) {
    return /^[\u0000-\uFFFF]*$/.test(str);
}

// Function to add data to the table
function addToTable(id, date, name, email, message) {
    const tableBody = document.querySelector('#dataTable tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${id}</td>
        <td>${date}</td>
        <td>${maskString(name)}</td>
        <td>${maskString(email)}</td>
        <td>${maskString(message)}</td>
    `;

    tableBody.appendChild(row);
}

// Function to mask part of the string
function maskString(str) {
    return str.slice(0, 3) + '*'.repeat(str.length - 3);
}

// Function to clear form fields
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
}

// Function to show notifications
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}