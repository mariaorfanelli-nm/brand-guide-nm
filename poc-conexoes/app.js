const word = document.getElementById('hero-word');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const phrases = ['o jurídico.', 'compras.', 'operações.', 'atendimento.', 'o RH.', 'compliance.', 'a pesquisa.', 'a saúde.', 'decisões.'];
let currentWord = 0;
let phraseTimer;
let inView = true;
function renderWord() { word.textContent = phrases[currentWord]; }
function canAnimate() { return inView && !document.hidden && !reducedMotion.matches; }
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
  if (reducedMotion.matches) { currentWord = phrases.length - 1; renderWord(); }
  else schedulePhrase();
}
reducedMotion.addEventListener('change', syncAnimation);
document.addEventListener('visibilitychange', syncAnimation);
const heroObserver = new IntersectionObserver(entries => {
  inView = entries[0].isIntersecting;
  syncAnimation();
});
renderWord();
syncAnimation();
heroObserver.observe(document.querySelector('.hero'));
