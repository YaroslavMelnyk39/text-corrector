const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const app = express();

require('dotenv').config();

const db = new sqlite3.Database('./corrections.db');
app.use(bodyParser.json());

app.use(express.static(__dirname));

app.post('/corrections', async (req, res) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', 
            {
                prompt: `Correct the following text and get it back without mistakes: ${req.body.sentence}`,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_TOKEN}`,
                    'Content-Type': 'application/json',
                }
            });
        const correctedSentence = response.data.choices[0].text.trim();

        db.run("INSERT INTO corrections (original_text, corrected_text) VALUES (?, ?)", [req.body.sentence, correctedSentence]);

        res.json({ original: req.body.sentence, corrected: correctedSentence });
    } catch (err) {
        console.error('Error making request:', err.response ? err.response.data : err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/corrections', (req, res) => {
    db.all("SELECT * FROM corrections", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/random', (req, res) => {
    db.get("SELECT * FROM corrections ORDER BY RANDOM() LIMIT 1", [], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});


db.run("CREATE TABLE IF NOT EXISTS corrections (id INTEGER PRIMARY KEY, original_text TEXT, corrected_text TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)");
