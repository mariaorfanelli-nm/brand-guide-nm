const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const menu = document.querySelector('.menu-toggle');
const nav = document.getElementById('site-nav');
function closeMenu() { nav?.classList.remove('is-open'); menu?.setAttribute('aria-expanded', 'false'); }
menu?.addEventListener('click', () => { const open = nav.classList.toggle('is-open'); menu.setAttribute('aria-expanded', String(open)); });
nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); document.querySelectorAll('.nav-cases[open]').forEach(el => el.open = false); } });
const rails = [...document.querySelectorAll('.logo-rail, .press-rail')];
function updateRail(rail) { const max = rail.scrollWidth - rail.clientWidth; document.querySelectorAll(`[data-rail="${rail.id}"]`).forEach(button => { button.disabled = Number(button.dataset.direction) < 0 ? rail.scrollLeft <= 2 : rail.scrollLeft >= max - 2; }); }
rails.forEach(rail => { updateRail(rail); rail.addEventListener('scroll', () => updateRail(rail), {passive:true}); rail.addEventListener('keydown', event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); rail.scrollBy({left:(event.key === 'ArrowRight'?1:-1)*rail.clientWidth*.75,behavior:reduced.matches?'instant':'smooth'}); } }); });
document.querySelectorAll('[data-rail]').forEach(button => button.addEventListener('click', () => { const rail=document.getElementById(button.dataset.rail); rail.scrollBy({left:Number(button.dataset.direction)*rail.clientWidth*.8,behavior:reduced.matches?'instant':'smooth'}); }));
addEventListener('resize', () => rails.forEach(updateRail));
addEventListener('load', () => rails.forEach(updateRail));
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
