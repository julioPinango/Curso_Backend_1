import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import path from 'path';

import productsRouter from './routers/productsRouter.js';
import cartsRouter from './routers/cartsRouter.js';
import viewsRouter from './routers/viewsRouter.js';
import exphbs from 'express-handlebars';

const app = express();

// Configuración de Handlebars
app.engine(
    "handlebars",
    exphbs.engine({
        defaultLayout: "main",
        helpers: {
            eq: (a, b) => a === b, // Definir el helper `eq`
        },
        runtimeOptions: {
            allowProtoPropertiesByDefault: true, // 🔥 Permite acceder a propiedades de objetos de Mongoose
            allowProtoMethodsByDefault: true,   // 🔥 Permite acceder a métodos si los necesitas
        }
    })
);
app.set('view engine', 'handlebars');


app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(error => console.error('Error de conexión:', error));

app.listen(8080, () => console.log('Servidor escuchando en el puerto http://localhost:8080'));