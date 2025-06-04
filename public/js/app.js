let notes = [];
let currentIndex = 0;
let autoSlide = null;

// Affiche la note actuelle
function renderNote(index) {
  const note = notes[index];
  if (!note) return;

  const titre = note.titre || "Sans titre";
  const verset = note.verset || "Aucun verset disponible.";
  const priere = note.priere || "Pas de prière fournie.";
  const citation = note.citation || "Aucune citation.";

  $('#note-container').html(`
    <div class="card shadow p-4 bg-white rounded-4">
      <div class="card-body">
        <h4 class="card-title">🌿 ${titre}</h4>
        <hr>
        <h6>📖 Verset biblique</h6>
        <p class="fst-italic">${verset}</p>
        <h6>🙏 Prière</h6>
        <p>${priere}</p>
        <h6>💬 Citation inspirante</h6>
        <blockquote class="blockquote">
          <p>${citation}</p>
        </blockquote>
        <div class="text-center mt-3 text-muted">
          <small>Méditation ${index + 1} / ${notes.length}</small>
        </div>
      </div>
    </div>
  `);
}

// Bouton : Générer les méditations depuis l'API
$('#generate-btn').click(() => {
  $('#note-container').html('<div class="text-center py-5">⏳ Génération en cours...</div>');
  clearInterval(autoSlide); // Stoppe l'auto-slide si actif

  $.post('/api/generate', {}, (data) => {
    if (data.notes && Array.isArray(data.notes) && data.notes.length > 0) {
      notes = data.notes;
      currentIndex = 0;
      renderNote(currentIndex);
    } else {
      $('#note-container').html('<div class="alert alert-warning">⚠️ Aucune méditation reçue.</div>');
    }
  }).fail((err) => {
    console.error("❌ Erreur API :", err);
    $('#note-container').html('<div class="alert alert-danger">❌ Erreur lors de la génération des méditations.</div>');
  });
});

// Bouton : Suivant
$('#next-btn').click(() => {
  if (currentIndex < notes.length - 1) {
    currentIndex++;
    renderNote(currentIndex);
  }
});

// Bouton : Précédent
$('#prev-btn').click(() => {
  if (currentIndex > 0) {
    currentIndex--;
    renderNote(currentIndex);
  }
});

// Bouton : Lecture automatique
$('#auto-btn').click(() => {
  clearInterval(autoSlide);
  if (notes.length === 0) return;

  autoSlide = setInterval(() => {
    if (currentIndex < notes.length - 1) {
      currentIndex++;
      renderNote(currentIndex);
    } else {
      clearInterval(autoSlide);
      $('#note-container').append(`
        <div class="text-center mt-3 text-success fw-bold">
          ✅ Fin de la lecture automatique.
        </div>
      `);
    }
  }, 10000); // Toutes les 10 secondes
});
