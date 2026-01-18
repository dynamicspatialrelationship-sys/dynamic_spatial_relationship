function autoScale() {
  const root = document.getElementById("scale-root");
  const baseWidth = 1200; // 必须与 CSS 中一致
  const scale = Math.min(window.innerWidth / baseWidth, 1);
  root.style.transform = `scale(${scale})`;
}

window.addEventListener("resize", autoScale);
window.addEventListener("load", autoScale);
