const word = document.getElementById('hero-word');
const motion = document.getElementById('motion-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const phrases = ['o jurídico.', 'compras.', 'operações.', 'atendimento.', 'o RH.', 'compliance.', 'a pesquisa.', 'a saúde.', 'decisões.'];
let currentWord = 0;
let phraseTimer;
let paused = false;
let complete = false;
function renderWord() {
  word.textContent = phrases[currentWord];
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
// Ao sair da abertura, a chamada assume sua mensagem final.
const heroObserver = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting && !complete) finishHeadline();
});
heroObserver.observe(document.querySelector('.hero'));
