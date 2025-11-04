import { Server } from 'socket.io';
import http from 'http';
import app from '../app.js';
import { sendMessageToEsp32 } from './esp32Server.js';

const httpServer = http.createServer(app); 
const io = new Server(httpServer);

let httpSocket;

io.on('connection', (socket) =>{

    httpSocket = socket;

    console.log("Browser conectado id: " + socket.id);

    socket.on('disconnect', () =>{
        console.log("Browser desconectado");
    });

    socket.on('click', () =>{
        console.log("Botão clicado");
        sendMessageToEsp32('ATIVAR_SAFEWAY');
    });
});

function sendPointToHttpServer(point){
    if (io) {
        io.emit('atualiza-ponto', point);
    }
}

function mostrarAlerta(){
    if(io){
        io.emit('safeway-ativado');
    }
}

function naoMostrarAlerta(){
    if(io){
        io.emit('safeway-desativado');
    }
}

export { httpServer, io, sendPointToHttpServer, mostrarAlerta, naoMostrarAlerta };