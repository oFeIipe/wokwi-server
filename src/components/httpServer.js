import { Server } from 'socket.io';
import http from 'http';
import app from '../app.js';
import { sendMessageToEsp32 } from './esp32Server.js';

const httpServer = http.createServer(app); 
const io = new Server(httpServer);

io.on('connection', (socket) =>{
    console.log("Browser conectado id: " + socket.id);

    socket.on('disconnect', () =>{
        console.log("Browser desconectado");
    });

    socket.on('click', () =>{
        console.log("Botão clicado");

        sendMessageToEsp32('ATIVAR_SAFEWAY');
    });
});

export { httpServer, io };
