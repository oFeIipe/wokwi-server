import { httpServer } from "./components/httpServer.js"
import { esp32server } from "./components/esp32Server.js";

const port = 8080;
const Esp32Port = 8081;

//Roda o servidor web na porta 8080
httpServer.listen(port, () => console.log("Servidor http rodando na porta " + port));
//Roda o servidor do ESP32 na porta 8081
esp32server.listen(Esp32Port, () => console.log('Servidor Esp32 TCP rodando na porta ' + Esp32Port));