

const mapa = L.map("mapa").setView([-22.8858, -47.0600], 12);
 
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap"
}).addTo(mapa);
 
 
// Pin
const centros = document.querySelectorAll(".centro");
const pins = []; // guarda { centro, marcador } para o filtro usar depois
 
centros.forEach(function (centro) {
  const lat = parseFloat(centro.dataset.lat);
  const lng = parseFloat(centro.dataset.lng);
  const nome = centro.querySelector("h3").textContent;
  const bairro = centro.querySelector("p").textContent;
 
  const marcador = L.marker([lat, lng])
    .addTo(mapa)
    .bindPopup("<b>" + nome + "</b><br>" + bairro);
 
  pins.push({ centro: centro, marcador: marcador });
 
  // Pin leva até os centros
  centro.style.cursor = "pointer";
  centro.addEventListener("click", function () {
    mapa.setView([lat, lng], 15);
    marcador.openPopup();
  });
});
 
 
//  3. Localização do usuário 
const x = document.getElementById("status");
let pinUsuario = null;
 
function getLocation() {
  if (navigator.geolocation) {
    x.innerHTML = "Buscando sua localização...";
    x.style.color = "";
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    x.innerHTML = "Seu navegador não permite usar a localização.";
  }
}
 
function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
 
  x.innerHTML = "Localização encontrada! Veja os centros perto de você no mapa.";
  x.style.color = "";
 
  // Pin vermelho do usuário
  if (pinUsuario) {
    mapa.removeLayer(pinUsuario);
  }
  pinUsuario = L.circleMarker([lat, lon], {
    radius: 9,
    color: "#ffffff",
    weight: 3,
    fillColor: "#d93025",
    fillOpacity: 1
  }).addTo(mapa).bindPopup("Você está aqui");
 
  mapa.setView([lat, lon], 14);
}
 

function error(err) {
  x.style.color = "#b3261e";
 
  if (err.code === err.PERMISSION_DENIED) {
    x.innerHTML = "Acesso à localização negado. Para ver os centros mais próximos, " +
                  "permita a localização nas configurações do navegador e tente de novo.";
  } else if (err.code === err.POSITION_UNAVAILABLE) {
    x.innerHTML = "Não foi possível descobrir sua localização agora.";
  } else if (err.code === err.TIMEOUT) {
    x.innerHTML = "A busca pela localização demorou demais. Tente de novo.";
  } else {
    x.innerHTML = "Erro ao obter localização.";
  }
}
 
 

const botoes = document.querySelectorAll(".filtro");
 
botoes.forEach(function (botao) {
  botao.addEventListener("click", function () {
    const categoria = botao.dataset.categoria;
 
    botoes.forEach(function (b) {
      b.classList.remove("ativo");
    });
    botao.classList.add("ativo");
 
    pins.forEach(function (item) {
      const mostrar = categoria === "todos" || item.centro.dataset.categoria === categoria;
 
      item.centro.style.display = mostrar ? "block" : "none";
 
      if (mostrar) {
        item.marcador.addTo(mapa);
      } else {
        mapa.removeLayer(item.marcador);
      }
    });
  });
});
 
