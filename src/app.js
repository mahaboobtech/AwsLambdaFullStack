const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const mysql = require('mysql');

const app = express();
const port = 3000;

// MySQL Database Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

const razorpay = new Razorpay({
    key_id: 'YOUR_RAZORPAY_KEY_ID',
    key_secret: 'YOUR_RAZORPAY_KEY_SECRET'
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.post('/payment', async (req, res) => {
    const { amount } = req.body;
    const options = {
        amount: amount * 100,
        currency: 'INR',
        receipt: 'receipt#1',
        payment_capture: 1
    };
    try {
        const response = await razorpay.orders.create(options);
        res.json(response);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/contact', (req, res) => {
    const { name, email, message, payment_id } = req.body;
    const sql = 'INSERT INTO contact_messages (name, email, message, payment_id) VALUES (?, ?, ?, ?)';
    connection.query(sql, [name, email, message, payment_id], (err, result) => {
        if (err) {
            console.error('Error storing contact message in database:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        console.log('Contact message stored in database');
        res.send('Contact message stored and payment successful!');
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
