const word = document.getElementById('hero-word');
const motion = document.getElementById('motion-toggle');
const counter = document.getElementById('hero-counter');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const phrases = ['o jurídico.', 'compras.', 'operações.', 'atendimento.', 'o RH.', 'compliance.', 'a pesquisa.', 'a saúde.', 'decisões.'];
let currentWord = 0;
let phraseTimer;
let paused = false;
let complete = false;
function renderWord() {
  word.textContent = phrases[currentWord];
  counter.textContent = `${String(currentWord + 1).padStart(2, '0')} / ${String(phrases.length).padStart(2, '0')}`;
}
function finishHeadline() {
  clearTimeout(phraseTimer);
  currentWord = phrases.length - 1;
  complete = true;
  word.classList.remove('changing');
  renderWord();
  motion.hidden = true;
}
function schedulePhrase() {
  phraseTimer = setTimeout(() => {
    if (paused || complete) return;
    word.classList.add('changing');
    phraseTimer = setTimeout(() => {
      currentWord += 1;
      renderWord();
      word.classList.remove('changing');
      if (currentWord === phrases.length - 1) {
        complete = true;
        motion.hidden = true;
      } else schedulePhrase();
    }, 270);
  }, 1800);
}
motion.addEventListener('click', () => {
  paused = !paused;
  motion.setAttribute('aria-pressed', String(paused));
  motion.setAttribute('aria-label', paused ? 'Retomar chamada animada' : 'Pausar chamada animada');
  motion.textContent = paused ? '▶' : 'Ⅱ';
  if (paused) { clearTimeout(phraseTimer); word.classList.remove('changing'); }
  else schedulePhrase();
});
renderWord();
if (reducedMotion.matches) finishHeadline(); else schedulePhrase();
reducedMotion.addEventListener('change', event => { if (event.matches) finishHeadline(); });
const chapters = [...document.querySelectorAll('[data-chapter]')];
const photos = [...document.querySelectorAll('[data-photo]')];
const dots = [...document.querySelectorAll('.photo-dots i')];
const captions = ['01 / UMA PERGUNTA ABRE O CAMINHO', '02 / DIFERENTES OLHARES, MAIS CONTEXTO', '03 / QUEM CONHECE O PROBLEMA, DECIDE'];
let activeChapter = 0;
let scrollPending = false;
function updateJourney() {
  const targetLine = innerWidth <= 600 ? innerHeight * .73 : innerHeight * .5;
  let next = 0;
  chapters.forEach((chapter, index) => { if (chapter.getBoundingClientRect().top < targetLine) next = index; });
  if (next !== activeChapter) {
    activeChapter = next;
    photos.forEach((photo, index) => { photo.classList.toggle('is-active', index === next); photo.setAttribute('aria-hidden', String(index !== next)); });
    dots.forEach((dot, index) => dot.classList.toggle('is-active', index === next));
    document.getElementById('photo-caption').textContent = captions[next];
  }
  if (!complete && document.querySelector('.hero').getBoundingClientRect().bottom < 0) finishHeadline();
  scrollPending = false;
}
function onScroll() { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateJourney); } }
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
updateJourney();
