(() => {
  "use strict";
  const params = new URLSearchParams(location.search);
  const artOnly = params.get("view") === "art";
  let format = params.get("format") === "linkedin" ? "linkedin" : "instagram";
  let piece = params.get("piece") === "single" ? "single" : "carousel";
  let slide = Math.min(5, Math.max(1, Number(params.get("slide")) || 1));
  const canvas = document.querySelector(".canvas");
  const frame = document.querySelector(".artboard-frame");
  const posts = [...document.querySelectorAll("[data-art]")];
  const formatButtons = [...document.querySelectorAll("[data-format]")];
  const pieceButtons = [...document.querySelectorAll("[data-piece]")];
  const dotButtons = [...document.querySelectorAll("[data-slide]")];
  const dimensions = document.querySelector("#format-dimensions");
  const label = document.querySelector("#art-label");

  document.body.classList.toggle("art-only", artOnly);

  function dimensionsForFormat() {
    return format === "linkedin" ? [1200, 1200] : [1080, 1350];
  }

  function fitPreview() {
    if (artOnly) return;
    const [width, height] = dimensionsForFormat();
    const isMobile = matchMedia("(max-width: 760px)").matches;
    const availableHeight = isMobile ? Infinity : Math.max(520, innerHeight - 170);
    const scale = Math.min(canvas.clientWidth / width, availableHeight / height, 1);
    frame.style.width = `${width * scale}px`;
    frame.style.height = `${height * scale}px`;
    canvas.style.setProperty("--preview-scale", scale);
    canvas.style.setProperty("--preview-width", `${width * scale}px`);
  }

  function syncUrl() {
    const url = new URL(location.href);
    url.searchParams.set("format", format);
    url.searchParams.set("piece", piece);
    if (piece === "carousel") url.searchParams.set("slide", slide); else url.searchParams.delete("slide");
    history.replaceState(null, "", url);
  }

  function render() {
    const [width, height] = dimensionsForFormat();
    const activeArt = piece === "single" ? "single" : `carousel-${slide}`;
    posts.forEach(post => {
      post.hidden = post.dataset.art !== activeArt;
      post.classList.toggle("post--square", format === "linkedin");
    });
    formatButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.format === format)));
    pieceButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.piece === piece)));
    dotButtons.forEach(button => button.setAttribute("aria-pressed", String(Number(button.dataset.slide) === slide)));
    document.querySelector(".slide-nav").hidden = piece !== "carousel";
    document.querySelectorAll("[data-note]").forEach(note => note.hidden = note.dataset.note !== piece);
    dimensions.textContent = `${width} × ${height} px`;
    label.textContent = piece === "carousel" ? `Carrossel · slide ${slide} de 5` : "Imagem única · processos";
    syncUrl();
    fitPreview();
  }

  formatButtons.forEach(button => button.addEventListener("click", () => { format = button.dataset.format; render(); }));
  pieceButtons.forEach(button => button.addEventListener("click", () => { piece = button.dataset.piece; render(); }));
  dotButtons.forEach(button => button.addEventListener("click", () => { slide = Number(button.dataset.slide); render(); }));
  document.querySelectorAll("[data-step]").forEach(button => button.addEventListener("click", () => {
    slide = ((slide - 1 + Number(button.dataset.step) + 5) % 5) + 1;
    render();
  }));
  addEventListener("keydown", event => {
    if (piece !== "carousel" || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    slide = ((slide - 1 + (event.key === "ArrowRight" ? 1 : -1) + 5) % 5) + 1;
    render();
  });
  if (!artOnly) {
    new ResizeObserver(fitPreview).observe(canvas);
    addEventListener("resize", fitPreview);
  }
  render();
})();
