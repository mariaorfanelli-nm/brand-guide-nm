const word = document.getElementById('hero-word');
const motion = document.getElementById('motion-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const phrases = ['o jurídico.', 'compras.', 'operações.', 'atendimento.', 'o RH.', 'compliance.', 'a pesquisa.', 'a saúde.', 'decisões.'];
let currentWord = 0;
let phraseTimer;
let paused = false;
let inView = true;
function renderWord() { word.textContent = phrases[currentWord]; }
function canAnimate() { return !paused && inView && !document.hidden && !reducedMotion.matches; }
function schedulePhrase() {
  if (!canAnimate()) return;
  const dwell = currentWord === phrases.length - 1 ? 3200 : 850;
  phraseTimer = setTimeout(() => {
    if (!canAnimate()) return;
    word.classList.add('changing');
    phraseTimer = setTimeout(() => {
      if (!canAnimate()) { word.classList.remove('changing'); return; }
      currentWord = (currentWord + 1) % phrases.length;
      renderWord();
      word.classList.remove('changing');
      schedulePhrase();
    }, 180);
  }, dwell);
}
function syncAnimation() {
  clearTimeout(phraseTimer);
  word.classList.remove('changing');
  motion.hidden = reducedMotion.matches;
  if (reducedMotion.matches) { currentWord = phrases.length - 1; renderWord(); }
  else schedulePhrase();
}
motion.addEventListener('click', () => {
  paused = !paused;
  motion.setAttribute('aria-pressed', String(paused));
  motion.setAttribute('aria-label', paused ? 'Retomar chamada animada' : 'Pausar chamada animada');
  motion.textContent = paused ? '▶' : 'Ⅱ';
  syncAnimation();
});
reducedMotion.addEventListener('change', syncAnimation);
document.addEventListener('visibilitychange', syncAnimation);
const heroObserver = new IntersectionObserver(entries => {
  inView = entries[0].isIntersecting;
  syncAnimation();
});
renderWord();
syncAnimation();
heroObserver.observe(document.querySelector('.hero'));
