import net from 'net';
import * as turf from '@turf/turf';
import { verificaPonto, calculaDistancia } from './turf.js';
import { sendPointToHttpServer, mostrarAlerta, naoMostrarAlerta } from './httpServer.js';

//Declara variável global que armazenará socket do servidor ESP
let esp32Socket;

//Cria o web socket do esp
const esp32server = net.createServer((socket) => {
    console.log('Cliente ESP32 conectado');
    

    esp32Socket = socket;

    //seta a codificação da comunicação dos dados enviados
    socket.setEncoding('utf8');

    //Adiciona um event listener que recebe dados
    socket.on('data', (data) =>{
        
        //Lê o JSON recebido e o serializa em um objeto
        let coordinate = JSON.parse(data.toString());

        //Cria um objeto do tipo turf.point com a longitude e latitude serializadas
        let point = turf.point([coordinate.lon, coordinate.lat])

        //Chama funções de verificação do ponto
        let result = verificaPonto(point);
        let distance = calculaDistancia(point)
        
        //Envia o ponto para o front-end
        sendPointToHttpServer(point);

        //Verifica se o resultado está dentro ou fora da área segura
        if(result){
            console.log("Está dentro");

            //Esconde o alerta do front-end
            naoMostrarAlerta();
        }
        else{

            //Envia uma mensagem para o socket do ESP, que o simulador recebe a string ATIVAR_SAFEWAY 
            sendMessageToEsp32("ATIVAR_SAFEWAY");

            //Mostra o alerta no front-end
            mostrarAlerta();
        }
        console.log("A distância entre os pontos é de: " + distance);
    });
    

    //Event listener que é acionado quando a comunicão termina
    socket.on('end', () => {
        console.log('Cliente desconectado');
        esp32Socket = null;
    });
    
    //Event listener que é acionado quando algum erro de comunicação acontece
    socket.on('error', (err) => {
        console.error('Erro de socket:', err);
        esp32Socket = null;
    });


    //Envia essa string para o simulador na conexão
    socket.write('ESP32 conectado\n\n');
});

function sendMessageToEsp32(message){
    //Verifica se existe uma conexão de socket existente, se houver e a função for acionada ele envia a mensagem ao ESP32
    if(esp32Socket && esp32Socket.writable){
        //Write é a função que envia a mensagem para o socket do simulador
        esp32Socket.write(message);
        console.log(`Mensagem enviada para o ESP32: ${message}`);
    } else {
        console.log('Nenhum ESP32 conectado ou o socket não está pronto para escrita.');
    }
}

//Exporta a variável e função para outros arquivos
export { esp32server, sendMessageToEsp32 };