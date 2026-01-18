const container = document.getElementById("container");

function videoPath(id, kind) {
  return `./videos/${id}_${kind}.mp4`;
}

fetch("./data.json")
  .then(r => r.json())
  .then(data => {
    container.innerHTML = data.map(d => `
      <div class="item">
        <div class="prompt">
          <strong>Prompt:</strong> ${d.prompt}
        </div>

        <div class="videos">
          <div class="video-col">
            <div class="video-label">Baseline</div>
            <video autoplay muted loop playsinline
              src="${videoPath(d.id, "baseline")}">
            </video>
          </div>

          <div class="video-col">
            <div class="video-label">Finetuned</div>
            <video autoplay muted loop playsinline
              src="${videoPath(d.id, "finetuned")}">
            </video>
          </div>
        </div>
      </div>
    `).join("");
  });
