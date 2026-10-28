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

// Escolha local de direção fotográfica; não envia aprovação a um servidor.
const photoChoices = [...document.querySelectorAll('[data-photo-choice]')];
const photoStatus = document.getElementById('photo-selection-status');
function selectPhotoDirection(value, persist = true) {
  photoChoices.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.photoChoice === value)));
  if (photoStatus) photoStatus.textContent = value ? `Preferência registrada neste navegador: ${value}. Comente no chat para confirmar a direção final.` : 'Nenhuma direção selecionada. Os botões guardam apenas sua preferência neste navegador.';
  if (persist) { try { localStorage.setItem('neuralmindPhotoDirection', value); } catch {} }
}
photoChoices.forEach(button => button.addEventListener('click', () => selectPhotoDirection(button.dataset.photoChoice)));
try { selectPhotoDirection(localStorage.getItem('neuralmindPhotoDirection') || '', false); } catch { selectPhotoDirection('', false); }
