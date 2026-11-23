// Localização do usuário 
const x = document.getElementById("status");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    x.innerHTML = "Geolocalização não é suportada por este navegador.";
  }
}

function error(err) {
  alert("Erro ao obter localização: " + err.message);
}

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  x.innerHTML = "Latitude: " + lat + "<br>Longitude: " + lon;

  const delta = 0.01;
  const bbox = (lon - delta) + "%2C" + (lat - delta) + "%2C" +
               (lon + delta) + "%2C" + (lat + delta);

  const mapaFrame = document.getElementById("mapa");
  mapaFrame.src = "https://www.openstreetmap.org/export/embed.html?bbox=" +
                  bbox + "&layer=mapnik&marker=" + lat + "%2C" + lon;
}

// Funcionamento dos filtros 
const botoes = document.querySelectorAll(".filtro");
const centros = document.querySelectorAll(".centro");

botoes.forEach(function (botao) {
  botao.addEventListener("click", function () {
    const categoria = botao.dataset.categoria;

    botoes.forEach(function (b) {
      b.classList.remove("ativo");
    });

    botao.classList.add("ativo");

    centros.forEach(function (centro) {
      if (categoria === "todos" || centro.dataset.categoria === categoria) {
        centro.style.display = "block";
      } else {
        centro.style.display = "none";
      }
    });
  });
});
