const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/generate', async (req, res) => {
  try {
    // 🔐 Vérifie que la clé API est bien là
    console.log("🔐 COHERE_API_KEY =", process.env.COHERE_API_KEY);

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
      model: 'command-r',
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    // 🔍 Affiche toute la réponse reçue de Cohere
    console.log("📦 Réponse complète Cohere:", JSON.stringify(response.data, null, 2));

    // ✅ Tente de récupérer le texte depuis generations[0].text ou text
    const rawText =
      response.data.generations?.[0]?.text ||
      response.data.text ||
      '';

    console.log("📝 Texte généré par Cohere :", rawText);

    const meditationBlocks = rawText.split(/\n(?=\d+\.\s*🌿)/).filter(Boolean);

    const notes = meditationBlocks.map(block => {
      const titreMatch = block.match(/🌿 Titre\s*:\s*(.+)/);
      const versetMatch = block.match(/📖 Verset biblique\s*([\s\S]*?)🙏/);
      const priereMatch = block.match(/🙏 Prière\s*([\s\S]*?)💬/);
      const citationMatch = block.match(/💬 Citation inspirante\s*([\s\S]*)/);

      return {
        titre: titreMatch ? titreMatch[1].trim() : '',
        verset: versetMatch ? versetMatch[1].trim() : '',
        priere: priereMatch ? priereMatch[1].trim() : '',
        citation: citationMatch ? citationMatch[1].trim() : ''
      };
    }).filter(note => note.titre && note.verset); // on garde seulement celles qui ont un titre et un verset

    res.status(200).json({ notes });

  } catch (error) {
    console.error('❌ Erreur Cohere :', error.message);
    if (error.response) {
      console.error('Détails API Cohere :', error.response.data);
    }
    res.status(500).json({ error: "Erreur lors de la génération." });
  }
});

module.exports = router;