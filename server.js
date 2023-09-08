const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Sample user data
const userData = {
    user_id: 'dhruv_sahu_15022002',
    email: 'ds8974@srmist.edu.in',
    roll_number: 'RA2011050010033',
};

function isNumber(str) {
    return !isNaN(str);
}

// Rate limiting middleware (15 requests per 15 seconds)
const limiter = rateLimit({
    windowMs: 15 * 1000, // 15 seconds
    max: 15, // 15 requests
    message: 'Too many API calls too fast',
    statusCode: 429, // Too Many Requests HTTP status code
});

// Apply rate limiter to all routes
app.use(limiter);

// Route: /bfhl | Method: POS
app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;

        if (!Array.isArray(data)) {
            throw new Error('Invalid request. "data" field must be in an array format.');
        }

        // Extract numbers and alphabets
        const numbers = data.filter(item => isNumber(item));
        const alphabets = data.filter(item => typeof item === 'string' && item.length === 1 && !isNumber(item));

        // Find the highest alphabet
        const highest_alphabet = alphabets.sort((a, b) => b.localeCompare(a))[0];

        // Prepare response
        const response = {
            is_success: true,
            user_id: userData.user_id,
            email: userData.email,
            roll_number: userData.roll_number,
            numbers,
            alphabets,
            highest_alphabet: highest_alphabet ? [highest_alphabet] : [],
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

// Route: /bfhl | Method: GET
app.get('/bfhl', (req, res) => {
    try {
        // GET request doesn't require any user input
        res.status(200).json({ operation_code: 1 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
``
