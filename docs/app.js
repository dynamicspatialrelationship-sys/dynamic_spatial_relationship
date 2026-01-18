const container = document.getElementById("container");

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ===== 路径规则（完全按你的目录与命名） ===== */
function videoPath(split, filename) {
  // split: "baseline" | "finetuned"
  return `./${split}/${filename}`;
}

function curvePath(split, filename) {
  // split: "baseline_score" | "finetuned_score"
  // curve 文件名是 "0001.mp4.png"
  return `./${split}/${filename}.png`;
}

/* ===== 整体缩放（保持 3 列不变） ===== */
function autoScale() {
  const root = document.getElementById("scale-root");
  const baseWidth =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--base-width"),
      10
    ) || 1440;

  const scale = Math.min(window.innerWidth / baseWidth, 1);
  root.style.transform = `scale(${scale})`;
}

window.addEventListener("resize", autoScale);
window.addEventListener("load", autoScale);

/* ===== 渲染 ===== */
fetch("./data.json", { cache: "no-store" })
  .then(r => r.json())
  .then(data => {
    container.innerHTML = data.map(d => {
      const v = d.video;   // e.g. "0001.mp4"
      const p = d.prompt;

      return `
        <div class="item">
          <div class="prompt">
            <strong>Prompt:</strong> ${escapeHtml(p || "")}
          </div>

          <div class="videos">
            <div class="video-col">
              <div class="video-label">Baseline</div>
              <video autoplay muted loop playsinline preload="metadata"
                src="${videoPath("baseline", v)}"></video>

              <img class="curve"
                src="${curvePath("baseline_score", v)}"
                alt="DSR curve (baseline)"
                loading="lazy"
                onerror="this.style.display='none';">
            </div>

            <div class="video-col">
              <div class="video-label">Finetuned</div>
              <video autoplay muted loop playsinline preload="metadata"
                src="${videoPath("finetune", v)}"></video>

              <img class="curve"
                src="${curvePath("finetune_score", v)}"
                alt="DSR curve (finetune)"
                loading="lazy"
                onerror="this.style.display='none';">
            </div>
          </div>
        </div>
      `;
    }).join("");

    autoScale();
  })
  .catch(err => {
    container.innerHTML = "<p>Failed to load data.json</p>";
    console.error(err);
  });
