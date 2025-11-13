let marcador = null;

//Se conecta com o web socket do httpServer
const socket = io('http://localhost:8080');

//Obtem dois elementos do html para representação visual
const posicao = document.getElementById("posicao");
const alerta = document.getElementById("alerta");

//inicia comunicação
socket.on('connection');

//Seta a vizualização inicial do mapa, perto da Estácio, o 12 é o zoom
const map = L.map('map').setView([-21.18, -47.81], 12);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);


//Cria uma matriz com as posições da área segura para representação visual
let safeArea = [
  [-21.20785381859451, -47.78820991516114],
  [-21.208458951501076, -47.78819650411606],
  [-21.208751514868194, -47.78557330369949],
  [-21.208108874915343, -47.78557330369949],
];

//Cria um retângulo a área segura definida acima
var polygon = L.rectangle(safeArea, {color: 'green'});

//Adiciona o retângulo no mapa
polygon.addTo(map);

//Função que atualiza o ponto no mapa
const atualizaPontoNoMapa = (point) => {
  //Marcador é a setinha que aparece. Remove ele se existir
  if(marcador)
    marcador.remove();
  
  //obtem a latitude e longitude do ponto
  const lat = point.geometry.coordinates[1];
  const lng = point.geometry.coordinates[0];

  //Seta o marcador com as posições novas
  marcador = L.marker([lat, lng]).addTo(map);

  //Muda o conteúdo do html com a posição nova
  posicao.innerText = `Última Posição: Lat ${lat.toFixed(5)}, Lng ${lng.toFixed(5)}`;
}

//Função que marca no mapa e mostra a posição no console do navegador

/*map.on('click', function(e) {
  
  if(marcador)
    marcador.remove();

  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  console.log(`Clicou em: Lat ${lat}, Lng ${lng}`);


  marcador = L.marker(e.latlng).addTo(map)
    .bindPopup("Você clicou aqui!")
    .openPopup();
});*/


/*Quando o event listener é ativado no http server, ele chama a função de atualizar o ponto no front-end, recebendo o ponto como
paramêtro e enviando a função*/
socket.on('atualiza-ponto', point => {
  atualizaPontoNoMapa(point);
});

//Quando o event-listener é ativado ele muda a cor do retângulo para vermelho
socket.on('safeway-ativado', () =>{
  if(polygon){
    polygon.setStyle({color: 'red'});
  }
  alerta.classList.toggle('oculto');
});

//Quando o event-listener é ativado ele muda a cor do retângulo para verde
socket.on('safeway-desativado', () =>{
  if(polygon){
    polygon.setStyle({color: 'green'});
  }
});