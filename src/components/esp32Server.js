import net from 'net';
import * as turf from '@turf/turf';
import { verificaPonto, calculaDistancia } from './turf.js';
import { sendPointToHttpServer, mostrarAlerta, naoMostrarAlerta } from './httpServer.js';
let esp32Socket;

const esp32server = net.createServer((socket) => {
    console.log('Cliente ESP32 conectado');
    
    esp32Socket = socket;

    socket.setEncoding('utf8');

    socket.on('data', (data) =>{
        let coordinate = JSON.parse(data.toString());
        let point = turf.point([coordinate.lon, coordinate.lat])

        let result = verificaPonto(point);
        let distance = calculaDistancia(point)
        
        sendPointToHttpServer(point);

        if(result){
            console.log("Está dentro");
            naoMostrarAlerta();
        }
        else{
            sendMessageToEsp32("ATIVAR_SAFEWAY");
            mostrarAlerta();
        }
        console.log("A distância entre os pontos é de: " + distance);
    });
    
    socket.on('end', () => {
        console.log('Cliente desconectado');
        esp32Socket = null;
    });
    
    socket.on('error', (err) => {
        console.error('Erro de socket:', err);
        esp32Socket = null;
    });

    socket.write('ESP32 conectado\n\n');
});

function sendMessageToEsp32(message){
    if(esp32Socket && esp32Socket.writable){
        esp32Socket.write(message);
        console.log(`Mensagem enviada para o ESP32: ${message}`);
    } else {
        console.log('Nenhum ESP32 conectado ou o socket não está pronto para escrita.');
    }
}

export { esp32server, sendMessageToEsp32 };