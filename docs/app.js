const container = document.getElementById("container");

function videoPath(id, kind) {
  return `./videos/${id}_${kind}.mp4`;
}

function curvePath(id, kind) {
  return `./curves/${id}_${kind}.png`;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* 窗口变窄时整体缩放（保持 3 列不变） */
function autoScale() {
  const root = document.getElementById("scale-root");
  const baseWidth = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--base-width"),
    10
  ) || 1440;
  const scale = Math.min(window.innerWidth / baseWidth, 1);
  root.style.transform = `scale(${scale})`;
}

window.addEventListener("resize", autoScale);
window.addEventListener("load", autoScale);

fetch("./data.json", { cache: "no-store" })
  .then(r => r.json())
  .then(data => {
    container.innerHTML = data.map(d => `
      <div class="item">
        <div class="prompt">
          <strong>Prompt:</strong> ${escapeHtml(d.prompt || "")}
        </div>

        <div class="videos">
          <div class="video-col">
            <div class="video-label">Baseline</div>
            <video autoplay muted loop playsinline preload="metadata"
              src="${videoPath(d.id, "baseline")}"></video>

            <img class="curve"
              src="${curvePath(d.id, "baseline")}"
              alt="DSR curve (baseline) for ${escapeHtml(d.id)}"
              loading="lazy"
              onerror="this.style.display='none';">
          </div>

          <div class="video-col">
            <div class="video-label">Finetuned</div>
            <video autoplay muted loop playsinline preload="metadata"
              src="${videoPath(d.id, "finetuned")}"></video>

            <img class="curve"
              src="${curvePath(d.id, "finetuned")}"
              alt="DSR curve (finetuned) for ${escapeHtml(d.id)}"
              loading="lazy"
              onerror="this.style.display='none';">
          </div>
        </div>
      </div>
    `).join("");

    autoScale();
  })
  .catch(err => {
    container.innerHTML = "<p>Failed to load data.json</p>";
    console.error(err);
  });
