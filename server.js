const express = require('express');
const productsRouter = require('./routers/productsRouter');
const cartsRouter = require('./routers/cartsRouter');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
