const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { CohereClient } = require('cohere-ai');
const { Pool } = require('pg');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/api/notes', async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM notes ORDER BY created_at DESC LIMIT 10");
  res.json(rows);
});

app.post('/api/generate', async (req, res) => {
  const prompt = "Génère une note spirituelle du jour avec un verset biblique, une prière inspirée et une citation motivante.";
  try {
    const response = await cohere.generate({
      model: 'command-r-plus',
      prompt,
      max_tokens: 300
    });

    const note = response.generations[0].text;
    await pool.query("INSERT INTO notes(content) VALUES($1)", [note]);
    res.json({ content: note });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la génération' });
  }
});

cron.schedule('*/20 * * * *', async () => {
  await pool.query("DELETE FROM notes WHERE created_at < NOW() - INTERVAL '20 minutes'");
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});