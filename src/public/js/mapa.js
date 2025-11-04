let marcador = null;

const socket = io('http://localhost:8080');
const posicao = document.getElementById("posicao");
const alerta = document.getElementById("alerta");

socket.on('connection');

const map = L.map('map').setView([-21.18, -47.81], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let safeArea = [
  [-21.20785381859451, -47.78820991516114],
  [-21.208458951501076, -47.78819650411606],
  [-21.208751514868194, -47.78557330369949],
  [-21.208108874915343, -47.78557330369949],
];

var polygon = L.rectangle(safeArea, {color: 'green'});
polygon.addTo(map);

const atualizaPontoNoMapa = (point) => {
  if(marcador)
    marcador.remove();
  
  const lat = point.geometry.coordinates[1];
  const lng = point.geometry.coordinates[0];

  marcador = L.marker([lat, lng]).addTo(map);
  posicao.innerText = `Última Posição: Lat ${lat.toFixed(5)}, Lng ${lng.toFixed(5)}`;
}

map.on('click', function(e) {
  
  if(marcador)
    marcador.remove();

  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  console.log(`Clicou em: Lat ${lat}, Lng ${lng}`);


  marcador = L.marker(e.latlng).addTo(map)
    .bindPopup("Você clicou aqui!")
    .openPopup();
});

socket.on('atualiza-ponto', point => {
  atualizaPontoNoMapa(point);
});

socket.on('safeway-ativado', () =>{
  if(polygon){
    polygon.setStyle({color: 'red'});
  }
  alerta.classList.toggle('oculto');
});

socket.on('safeway-desativado', () =>{
  if(polygon){
    polygon.setStyle({color: 'green'});
  }
});