let notes = [];
let currentIndex = 0;
let autoSlide;

function renderNote(index) {
  const note = notes[index];
  if (!note) return;

  $('#note-container').html(`
    <div class="card shadow p-4 bg-white rounded-4">
      <div class="card-body">
        <h4 class="card-title">🌿 ${note.titre}</h4>
        <hr>
        <h6>📖 Verset biblique</h6>
        <p class="fst-italic">${note.verset}</p>
        <h6>🙏 Prière</h6>
        <p>${note.priere}</p>
        <h6>💬 Citation inspirante</h6>
        <blockquote class="blockquote">
          <p>${note.citation}</p>
        </blockquote>
        <div class="text-center mt-3 text-muted"><small>Méditation ${index + 1} / ${notes.length}</small></div>
      </div>
    </div>
  `);
}

$('#generate-btn').click(() => {
  $('#note-container').html('<div class="text-center py-5">⏳ Génération en cours...</div>');
  $.post('/api/generate', {}, (data) => {
    if (data.notes && Array.isArray(data.notes)) {
      notes = data.notes;
      currentIndex = 0;
      renderNote(currentIndex);
    } else {
      $('#note-container').html('<div class="alert alert-danger">⚠️ Aucune méditation reçue.</div>');
    }
  }).fail(() => {
    $('#note-container').html('<div class="alert alert-danger">❌ Erreur lors de la génération.</div>');
  });
});

$('#next-btn').click(() => {
  if (currentIndex < notes.length - 1) {
    currentIndex++;
    renderNote(currentIndex);
  }
});

$('#prev-btn').click(() => {
  if (currentIndex > 0) {
    currentIndex--;
    renderNote(currentIndex);
  }
});

$('#auto-btn').click(() => {
  clearInterval(autoSlide);
  autoSlide = setInterval(() => {
    $('#next-btn').click();
    if (currentIndex >= notes.length - 1) clearInterval(autoSlide);
  }, 10000); // Toutes les 10 secondes
});
