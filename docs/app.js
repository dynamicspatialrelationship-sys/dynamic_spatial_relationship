const grid = document.getElementById("grid");
const meta = document.getElementById("meta");

const searchEl = document.getElementById("search");
const groupEl = document.getElementById("groupFilter");
const animalEl = document.getElementById("animalFilter");
const objectEl = document.getElementById("objectFilter");
const autoplayEl = document.getElementById("autoplay");
const syncEl = document.getElementById("syncPlay");

let data = [];

function uniq(arr){
  return [...new Set(arr.filter(Boolean))].sort();
}

function videoPath(id, kind){
  return `./videos/${id}_${kind}.mp4`;
}

function render(){
  const q = searchEl.value.toLowerCase();
  const g = groupEl.value;
  const a = animalEl.value;
  const o = objectEl.value;

  const view = data.filter(d=>{
    if(g && d.group!==g) return false;
    if(a && d.animal!==a) return false;
    if(o && d.object!==o) return false;
    if(!q) return true;
    return JSON.stringify(d).toLowerCase().includes(q);
  });

  meta.textContent = `Showing ${view.length} / ${data.length} items`;

  grid.innerHTML = view.map(d=>`
    <div class="card">
      <div class="cardHeader">
        <div>ID ${d.id}</div>
        <div>${d.group || ""}</div>
      </div>

      <div class="prompt">
        ${d.prompt}
      </div>

      <div class="pair">
        <div class="pairCol">
          <div class="label">Baseline</div>
          <video ${autoplayEl.checked?"autoplay":""}
                 ${syncEl.checked?"":""}
                 muted loop playsinline
                 src="${videoPath(d.id,"baseline")}"></video>
        </div>

        <div class="pairCol">
          <div class="label">Finetuned</div>
          <video ${autoplayEl.checked?"autoplay":""}
                 muted loop playsinline
                 src="${videoPath(d.id,"finetuned")}"></video>
        </div>
      </div>
    </div>
  `).join("");
}

function setupFilters(){
  groupEl.innerHTML += uniq(data.map(d=>d.group))
    .map(v=>`<option value="${v}">${v}</option>`).join("");

  animalEl.innerHTML += uniq(data.map(d=>d.animal))
    .map(v=>`<option value="${v}">${v}</option>`).join("");

  objectEl.innerHTML += uniq(data.map(d=>d.object))
    .map(v=>`<option value="${v}">${v}</option>`).join("");
}

[searchEl, groupEl, animalEl, objectEl, autoplayEl].forEach(
  el=>el.addEventListener("input",render)
);

fetch("./data.json")
  .then(r=>r.json())
  .then(j=>{
    data = j;
    setupFilters();
    render();
  });
