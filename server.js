// Import required modules
const express = require('express'); // Express framework for handling HTTP requests
const path = require('path'); // Node.js module for working with file paths
const nodemailer = require('nodemailer'); // Module for sending emails
const bodyParser = require('body-parser'); // Middleware for parsing request bodies

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3000; // Use the environment port or default to 3000

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve the main HTML file
});

// Configure nodemailer for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail as the email service
    auth: {
        user: process.env.EMAIL_USER, // Email address (from environment variables)
        pass: process.env.EMAIL_PASS // Email password (from environment variables)
    }
});

// Route for handling form submissions
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body; // Extract data from the request body

    // Configure the email options
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender email address
        to: 'vovchok-vodol@rambler.ru', // Recipient email address
        subject: 'New Form Submission', // Email subject
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}` // Email body
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.json({ success: false }); // Respond with an error
        } else {
            console.log('Email sent:', info.response);
            res.json({ success: true, id: idCounter++ }); // Respond with success
        }
    });
});

// Counter for generating unique IDs for submitted data
let idCounter = 1;

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});