(() => {
  "use strict";
  const post = document.querySelector("#post");
  const frame = document.querySelector(".artboard-frame");
  const canvas = document.querySelector(".canvas");
  const dimensions = document.querySelector("#format-dimensions");
  const buttons = [...document.querySelectorAll("[data-format]")];
  const params = new URLSearchParams(window.location.search);
  const artOnly = params.get("view") === "art";
  let format = params.get("format") === "linkedin" ? "linkedin" : "instagram";

  document.body.classList.toggle("art-only", artOnly);

  function fitPreview() {
    if (artOnly) return;
    const width = format === "linkedin" ? 1200 : 1080;
    const height = format === "linkedin" ? 1200 : 1350;
    const availableWidth = canvas.clientWidth;
    const isMobile = window.matchMedia("(max-width: 650px)").matches;
    const availableHeight = isMobile ? Infinity : Math.max(470, window.innerHeight - 184);
    const scale = Math.min(availableWidth / width, availableHeight / height, 1);
    frame.style.width = `${width * scale}px`;
    frame.style.height = `${height * scale}px`;
    canvas.style.setProperty("--preview-scale", scale);
    canvas.style.setProperty("--preview-width", `${width * scale}px`);
  }

  function showFormat(nextFormat) {
    format = nextFormat;
    post.classList.toggle("post--square", format === "linkedin");
    buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.format === format)));
    dimensions.textContent = format === "linkedin" ? "1200 × 1200 px" : "1080 × 1350 px";
    fitPreview();
  }

  buttons.forEach(button => button.addEventListener("click", () => {
    const nextFormat = button.dataset.format;
    const url = new URL(window.location.href);
    url.searchParams.set("format", nextFormat);
    window.history.replaceState(null, "", url);
    showFormat(nextFormat);
  }));

  if (!artOnly) {
    new ResizeObserver(fitPreview).observe(canvas);
    window.addEventListener("resize", fitPreview);
  }
  showFormat(format);
})();
