const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// Middleware для обработки JSON
app.use(bodyParser.json());

// Указываем, что статические файлы (HTML, CSS, JS) находятся в текущей директории
app.use(express.static(path.join(__dirname)));

// Маршрут для корневого URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Настройка nodemailer для Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Ваш Gmail
        pass: 'your-app-password' // Используйте App Password, если включена 2FA
    }
});

// Маршрут для отправки email
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: 'your-email@gmail.com', // От кого
        to: 'vovchok-vodol@rambler.ru', // Кому
        subject: 'New Form Submission', // Тема письма
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}` // Текст письма
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.json({ success: false });
        } else {
            console.log('Email sent:', info.response);
            res.json({ success: true, id: idCounter++ });
        }
    });
});

let idCounter = 1;

// Запуск сервера
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});