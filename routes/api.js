const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/generate', async (req, res) => {
  try {
    const prompt = `Génère 20 méditations chrétiennes en français dans ce format :
1. 🌿 Titre
📖 Verset
🙏 Prière
💬 Citation
Thèmes variés : Espérance, Foi, Paix, etc.`;

    const response = await axios.post('https://api.cohere.ai/v1/chat', {
      message: prompt,
      model: "command-r",
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    res.json({ notes: response.data.text });  // à parser côté client
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur lors de la génération.");
  }
});

module.exports = router;
