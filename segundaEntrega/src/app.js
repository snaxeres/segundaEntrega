import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import viewsRouter from './routes/views.router.js';
import fs from 'fs';


const app = express();
const PORT = process.env.PORT || 9090;



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.engine('handlebars', engine({
    layoutsDir: path.join(__dirname, 'views/layouts'),
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/', viewsRouter);

// Iniciar el server
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Configurar Socket.io
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('newProduct', (product) => {
        const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/products.json'), 'utf-8'));
        products.push(product);
        fs.writeFileSync(path.join(__dirname, 'data/products.json'), JSON.stringify(products, null, 2));
        io.emit('updateProducts', products);
    });

    socket.on('deleteProduct', (productId) => {
        let products = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/products.json'), 'utf-8'));
        products = products.filter(p => p.id !== productId);
        fs.writeFileSync(path.join(__dirname, 'data/products.json'), JSON.stringify(products, null, 2));
        io.emit('updateProducts', products);
    });
});

