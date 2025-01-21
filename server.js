const express = require('express');
const { create } = require('express-handlebars');
const { Server: SocketIOServer } = require('socket.io');
const http = require('http');
const productsRouter = require('./routers/productsRouter');
const cartsRouter = require('./routers/cartsRouter');
const viewsRouter = require('./routers/viewsRouter');
const { readProducts } = require('./controllers/productsController');

const app = express();
const PORT = 8080;
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer);

// Configuración de Handlebars
const hbs = create({
  extname: '.handlebars',
});
app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', './views');

app.use(express.json());
app.use(express.static('public'));

// Middleware para inyectar WebSocket en las rutas
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// WebSocket
io.on('connection', (socket) => {
  console.log('Cliente conectado');
  socket.emit('updateProducts', readProducts());
});

// Iniciar servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
