require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// CRUD Operations
app.get('/items', (req, res) => {
    db.query('SELECT * FROM items', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/items/:id', (req, res) => {
    db.query('SELECT * FROM items WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.post('/items', (req, res) => {
    const { name, description } = req.body;
    db.query('INSERT INTO items (name, description) VALUES (?, ?)', [name, description], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, name, description });
    });
});

app.put('/items/:id', (req, res) => {
    const { name, description } = req.body;
    db.query('UPDATE items SET name = ?, description = ? WHERE id = ?', [name, description, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Item updated successfully' });
    });
});

app.delete('/items/:id', (req, res) => {
    db.query('DELETE FROM items WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Item deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

