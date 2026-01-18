const container = document.getElementById("container");

function videoPath(id, kind) {
  return `./videos/${id}_${kind}.mp4`;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

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
          </div>

          <div class="video-col">
            <div class="video-label">Finetuned</div>
            <video autoplay muted loop playsinline preload="metadata"
              src="${videoPath(d.id, "finetuned")}"></video>
          </div>
        </div>
      </div>
    `).join("");
  })
  .catch(err => {
    container.innerHTML = "<p>Failed to load data.json</p>";
    console.error(err);
  });
