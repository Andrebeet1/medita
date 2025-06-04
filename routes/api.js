const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/generate', async (req, res) => {
  try {
    const prompt = `Génère 20 méditations chrétiennes en français dans ce format clair et structuré :

1. 🌿 Titre : [titre]
📖 Verset biblique

[Texte du verset]
— [Référence]

🙏 Prière

[Texte de la prière]

💬 Citation inspirante

[Texte de la citation]
— [Auteur ou référence]

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

    const rawText = response.data.text;

    const meditationBlocks = rawText.split(/\n(?=\d+\.\s*🌿)/); // split chaque méditation

    const notes = meditationBlocks.map(block => {
      return {
        titre: block.match(/🌿 Titre\s*:\s*(.*)/)?.[1]?.trim() || '',
        verset: block.match(/📖 Verset biblique\s*([\s\S]*?)🙏 Prière/)?.[1]?.trim() || '',
        priere: block.match(/🙏 Prière\s*([\s\S]*?)💬 Citation inspirante/)?.[1]?.trim() || '',
        citation: block.match(/💬 Citation inspirante\s*([\s\S]*)/)?.[1]?.trim() || ''
      };
    }).filter(note => note.titre); // on garde que les notes valides

    res.json({ notes });

  } catch (error) {
    console.error('Erreur Cohere :', error.message);
    res.status(500).send("Erreur lors de la génération.");
  }
});

module.exports = router;
