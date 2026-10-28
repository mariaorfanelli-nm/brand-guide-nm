const body = document.body;
const themeToggle = document.querySelector(".theme-toggle");
const sidebarToggle = document.querySelector(".sidebar-toggle");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function setTheme(isDark, shouldPersist = true) {
  body.classList.toggle("theme-dark", isDark);
  body.classList.toggle("theme-light", !isDark);
  themeToggle?.setAttribute("aria-pressed", String(isDark));
  if (shouldPersist) {
    localStorage.setItem("brandGuideTheme", isDark ? "dark" : "light");
  }
}

const storedTheme = localStorage.getItem("brandGuideTheme");
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
setTheme(storedTheme ? storedTheme === "dark" : prefersDark, false);

themeToggle?.addEventListener("click", () => {
  setTheme(!body.classList.contains("theme-dark"));
});

function setSidebarCollapsed(isCollapsed) {
  body.classList.toggle("sidebar-collapsed", isCollapsed);
  sidebarToggle?.setAttribute("aria-expanded", String(!isCollapsed));
  sidebarToggle?.setAttribute("aria-label", isCollapsed ? "Expandir menu lateral" : "Colapsar menu lateral");
  localStorage.setItem("brandGuideSidebarCollapsed", String(isCollapsed));
}

setSidebarCollapsed(localStorage.getItem("brandGuideSidebarCollapsed") === "true");

sidebarToggle?.addEventListener("click", () => {
  setSidebarCollapsed(!body.classList.contains("sidebar-collapsed"));
});

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] },
);

sections.forEach((section) => observer.observe(section));

async function copyText(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    const original = button.textContent;
    button.textContent = "Copied";
    window.setTimeout(() => {
      button.textContent = original;
    }, 1400);
  } catch {
    const original = button.textContent;
    button.textContent = "Copy failed";
    window.setTimeout(() => {
      button.textContent = original;
    }, 1400);
  }
}

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (target) copyText(target.innerText.trim(), button);
  });
});

document.querySelectorAll(".copy-svg").forEach((button) => {
  button.addEventListener("click", () => {
    const svg = button.closest(".icon-card")?.querySelector("svg");
    if (svg) copyText(svg.outerHTML, button);
  });
});

const deck = document.querySelector(".slide-deck");
const slides = [...document.querySelectorAll(".brand-slide")];

function currentSlideIndex() {
  if (!deck || !slides.length) return 0;
  const deckTop = deck.getBoundingClientRect().top;
  return slides.reduce((closestIndex, slide, index) => {
    const currentDistance = Math.abs(slide.getBoundingClientRect().top - deckTop);
    const closestDistance = Math.abs(slides[closestIndex].getBoundingClientRect().top - deckTop);
    return currentDistance < closestDistance ? index : closestIndex;
  }, 0);
}

document.querySelector("[data-slide-prev]")?.addEventListener("click", () => {
  slides[Math.max(0, currentSlideIndex() - 1)]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

document.querySelector("[data-slide-next]")?.addEventListener("click", () => {
  slides[Math.min(slides.length - 1, currentSlideIndex() + 1)]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

// Galeria fotográfica: filtros e ampliação acessíveis, sem dependências externas.
const photoCards = [...document.querySelectorAll('.photo-gallery-card')];
const photoFilters = [...document.querySelectorAll('[data-photo-filter]')];
const photoDialog = document.querySelector('.photo-gallery-dialog');
let activePhotoCard = null;
function visiblePhotoCards() { return photoCards.filter(card => !card.hidden); }
function showPhoto(card) {
  if (!photoDialog || !card) return;
  activePhotoCard = card;
  const source = card.querySelector('img');
  document.getElementById('photo-dialog-title').textContent = card.querySelector('h3').textContent;
  const image = document.getElementById('photo-dialog-image');
  image.src = source.getAttribute('src'); image.alt = source.alt;
  document.getElementById('photo-dialog-description').textContent = card.querySelector('figcaption p').textContent + ' Estudo conceitual gerado por IA.';
  document.getElementById('photo-dialog-download').href = source.getAttribute('src');
  if (!photoDialog.open) photoDialog.showModal();
}
function advancePhoto(step) {
  const cards = visiblePhotoCards();
  if (cards.length) showPhoto(cards[(cards.indexOf(activePhotoCard) + step + cards.length) % cards.length]);
}
photoFilters.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.photoFilter;
  photoFilters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  photoCards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.photoCategory !== filter; });
  const count = visiblePhotoCards().length;
  document.getElementById('photo-gallery-count').textContent = `${count} ${count === 1 ? 'imagem' : 'imagens'}`;
}));
photoCards.forEach(card => card.querySelector('.photo-gallery-open').addEventListener('click', () => showPhoto(card)));
document.querySelector('[data-photo-close]')?.addEventListener('click', () => photoDialog.close());
document.querySelector('[data-photo-prev]')?.addEventListener('click', () => advancePhoto(-1));
document.querySelector('[data-photo-next]')?.addEventListener('click', () => advancePhoto(1));
photoDialog?.addEventListener('click', event => { if (event.target === photoDialog) photoDialog.close(); });
photoDialog?.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); advancePhoto(event.key === 'ArrowRight' ? 1 : -1); }
});
