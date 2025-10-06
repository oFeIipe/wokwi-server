import express from 'express'
import { dirname } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDirectoryPath = path.join(__dirname, 'public');
app.use(express.static(publicDirectoryPath));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'view'));

app.get("/", (request, response) => {
    response.render('index');
});

export default app;