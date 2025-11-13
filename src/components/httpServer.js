import { Server } from 'socket.io';
import http from 'http';
import app from '../app.js';
import { sendMessageToEsp32 } from './esp32Server.js';

//Cria o um servidor usando o servidor express
const httpServer = http.createServer(app);

//Cria o socket web usando o servidor acima
const io = new Server(httpServer);


//Variável global que armazena o socket web
let httpSocket;

//Inicia o socket para receber conexões
io.on('connection', (socket) =>{

    //Armazena o socket na variavel global
    httpSocket = socket;

    console.log("Browser conectado id: " + socket.id);

    socket.on('disconnect', () =>{
        console.log("Browser desconectado");
    });


    //Função antiga que acionava o ESP32 quando um botão no front-end era clicado
    socket.on('click', () =>{
        console.log("Botão clicado");
        sendMessageToEsp32('ATIVAR_SAFEWAY');
    });
});

function sendPointToHttpServer(point){
    if (io) {
        //Função que manda dados para o mapa.js, javaScript do front-end
        io.emit('atualiza-ponto', point);
    }
}

function mostrarAlerta(){
    if(io){
        //Função que manda sinal para ativar alerta no front-end
        io.emit('safeway-ativado');
    }
}

function naoMostrarAlerta(){
    if(io){
        //Função que manda sinal para desativar alerta no front-end
        io.emit('safeway-desativado');
    }
}

//Exporta funções e variáveis
export { httpServer, io, sendPointToHttpServer, mostrarAlerta, naoMostrarAlerta };