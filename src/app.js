import express from 'express'
import { dirname } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';


//Cria um servidor express
const app = express();

//Adiciona o path de arquivos estáticos ao servidor
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDirectoryPath = path.join(__dirname, 'public');
app.use(express.static(publicDirectoryPath));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'view'));


//Retorna a tela inicial do servidor "view/index.ejs"
app.get("/", (request, response) => {
    response.render('index');
});

export default app;