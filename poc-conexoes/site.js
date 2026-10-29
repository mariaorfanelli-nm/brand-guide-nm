const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const menu = document.querySelector('.menu-toggle');
const nav = document.getElementById('site-nav');
function closeMenu() { nav?.classList.remove('is-open'); menu?.setAttribute('aria-expanded', 'false'); }
menu?.addEventListener('click', () => { const open = nav.classList.toggle('is-open'); menu.setAttribute('aria-expanded', String(open)); });
nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); document.querySelectorAll('.nav-cases[open]').forEach(el => el.open = false); } });
const rails = [...document.querySelectorAll('.logo-rail, .press-rail')];
const railStates = new Map();
function updateRail(rail) {
  const max = rail.scrollWidth - rail.clientWidth;
  document.querySelectorAll(`[data-rail="${rail.id}"]`).forEach(button => {
    button.disabled = Number(button.dataset.direction) < 0 ? rail.scrollLeft <= 2 : rail.scrollLeft >= max - 2;
  });
}
function scheduleRail(rail) {
  const state = railStates.get(rail);
  clearTimeout(state.timer);
  const blocked = state.hover || state.focus || !state.visible || document.hidden || reduced.matches;
  rail.dataset.autoplayState = blocked ? 'paused' : 'running';
  if (blocked || rail.scrollWidth <= rail.clientWidth + 2) return;
  state.timer = setTimeout(() => {
    const max = rail.scrollWidth - rail.clientWidth;
    if (rail.scrollLeft >= max - 3) rail.scrollTo({left:0,behavior:'instant'});
    else {
      const item = rail.firstElementChild;
      const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
      rail.scrollBy({left:item.getBoundingClientRect().width + gap,behavior:'smooth'});
    }
    scheduleRail(rail);
  }, rail.id === 'clients-rail' ? 2600 : 6000);
}
rails.forEach(rail => {
  const section = rail.closest('.client-band, .press-section');
  railStates.set(rail, {hover:false,focus:false,visible:false,timer:undefined});
  const state = railStates.get(rail);
  section.addEventListener('mouseenter', () => {state.hover=true; scheduleRail(rail);});
  section.addEventListener('mouseleave', () => {state.hover=false; scheduleRail(rail);});
  section.addEventListener('focusin', () => {state.focus=true; scheduleRail(rail);});
  section.addEventListener('focusout', event => {if (!section.contains(event.relatedTarget)) {state.focus=false; scheduleRail(rail);}});
  const observer = new IntersectionObserver(entries => {state.visible=entries[0].isIntersecting; scheduleRail(rail);}, {threshold:.15});
  observer.observe(rail);
  rail.addEventListener('scroll', () => updateRail(rail), {passive:true});
  rail.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      rail.scrollBy({left:(event.key === 'ArrowRight'?1:-1)*rail.clientWidth*.75,behavior:reduced.matches?'instant':'smooth'});
    }
  });
  updateRail(rail);
});
document.querySelectorAll('[data-rail]').forEach(button => button.addEventListener('click', () => {
  const rail=document.getElementById(button.dataset.rail);
  rail.scrollBy({left:Number(button.dataset.direction)*rail.clientWidth*.8,behavior:reduced.matches?'instant':'smooth'});
  scheduleRail(rail);
}));
function refreshRails() {rails.forEach(rail => {updateRail(rail);scheduleRail(rail);});}
addEventListener('resize', refreshRails);
addEventListener('load', refreshRails);
document.addEventListener('visibilitychange', refreshRails);
reduced.addEventListener('change', refreshRails);
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => { const filter=button.dataset.filter; document.querySelectorAll('[data-filter]').forEach(el => el.setAttribute('aria-pressed',String(el === button))); document.querySelectorAll('[data-category]').forEach(article => article.hidden = filter !== 'all' && article.dataset.category !== filter); }));
document.querySelectorAll('[data-mail-form]').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const lines = [`Nome: ${data.get('nome')}`,`E-mail: ${data.get('email')}`,`Contexto: ${data.get('contexto')}`];
  if (data.get('curriculo')) lines.push(`Currículo: ${data.get('curriculo')}`);
  lines.push('',String(data.get('mensagem')));
  const url = `mailto:${form.dataset.recipient}?subject=${encodeURIComponent(form.dataset.subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  window.location.href = url;
  form.querySelector('.form-status').textContent = 'Revise a mensagem no seu aplicativo de e-mail antes de enviar. Se ele não abrir, use o endereço de contato ao lado.';
}));
