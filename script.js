// --- Calculateur de prix ---
function calculerPrix() {
  const composants = document.getElementById("composants").value;
  const heures = document.getElementById("heures").value;
  const prix = composants * 10 + heures * 15;
  document.getElementById("resultat").innerText = "Prix estimé : " + prix + " €";
}

// --- Configurateur (popup) ---
const configBtn = document.getElementById("configurateurBtn");
const configModal = document.getElementById("configModal");
const fermerBtn = document.getElementById("fermerConfig");
const configResult = document.getElementById("configResult");

configBtn.onclick = () => {
  configModal.style.display = "flex";
};

fermerBtn.onclick = () => {
  configModal.style.display = "none";
};

document.getElementById("cpu").onchange =
document.getElementById("gpu").onchange =
document.getElementById("ram").onchange = function() {
  const cpu = document.getElementById("cpu").value;
  const gpu = document.getElementById("gpu").value;
  const ram = document.getElementById("ram").value;

  configResult.innerText = "Ta config : " + cpu + " + " + gpu + " + " + ram;
};

// --- Animation Halloween (citrouilles) ---
document.addEventListener("DOMContentLoaded", () => {
  for (let i = 0; i < 10; i++) {
    let citrouille = document.createElement("img");
    citrouille.src = "https://cdn-icons-png.flaticon.com/512/4151/4151405.png";
    citrouille.classList.add("citrouille");
    citrouille.style.left = Math.random() * 100 + "vw";
    citrouille.style.animationDuration = (Math.random() * 3 + 2) + "s";
    document.body.appendChild(citrouille);
  }
});
