let notes = [];
let currentIndex = 0;
let autoSlide;

function renderNote(index) {
  const note = notes[index];
  $('#note-container').html(`
    <div class="card shadow p-4 bg-white rounded-4">
      <div class="card-body">
        ${note}
        <div class="text-center mt-3 text-muted"><small>Note ${index + 1}/20</small></div>
      </div>
    </div>
  `);
}

function parseNotes(raw) {
  return raw.split(/\n(?=\d+\.\s*🌿)/).map(n => n.trim());
}

$('#generate-btn').click(() => {
  $.post('/api/generate', {}, (data) => {
    notes = parseNotes(data.notes);
    currentIndex = 0;
    renderNote(currentIndex);
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
  }, 10000);
});
