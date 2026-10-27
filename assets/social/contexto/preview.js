(() => {
  "use strict";

  const params = new URLSearchParams(location.search);
  const artOnly = params.get("view") === "art";
  let format = params.get("format") === "linkedin" ? "linkedin" : "instagram";
  const canvas = document.querySelector(".canvas");
  const frame = document.querySelector(".artboard-frame");
  const post = document.querySelector(".post");
  const controls = [...document.querySelectorAll("[data-format]")];
  const dimensions = document.querySelector("#format-dimensions");

  document.body.classList.toggle("art-only", artOnly);

  function size() {
    return format === "linkedin" ? [1200, 1200] : [1080, 1350];
  }

  function fitPreview() {
    if (artOnly) return;
    const [width, height] = size();
    const compact = matchMedia("(max-width: 760px)").matches;
    const availableHeight = compact ? Infinity : Math.max(520, innerHeight - 170);
    const scale = Math.min(canvas.clientWidth / width, availableHeight / height, 1);
    frame.style.width = `${width * scale}px`;
    frame.style.height = `${height * scale}px`;
    canvas.style.setProperty("--preview-scale", scale);
    canvas.style.setProperty("--preview-width", `${width * scale}px`);
  }

  function render() {
    const [width, height] = size();
    post.classList.toggle("post--square", format === "linkedin");
    controls.forEach(control => control.setAttribute("aria-pressed", String(control.dataset.format === format)));
    dimensions.textContent = `${width} × ${height} px`;
    const url = new URL(location.href);
    url.searchParams.set("format", format);
    history.replaceState(null, "", url);
    fitPreview();
  }

  controls.forEach(control => control.addEventListener("click", () => {
    format = control.dataset.format;
    render();
  }));

  if (!artOnly) {
    new ResizeObserver(fitPreview).observe(canvas);
    addEventListener("resize", fitPreview);
  }

  render();
})();
