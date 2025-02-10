const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const productsFilePath = path.join(__dirname, '../data/productos.json');

const readProducts = () => {
    const data = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(data);
};

const writeProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

const getProducts = async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
    };

    const filter = query ? { category: query } : {};

    try {
        const products = await Product.paginate(filter, options);
        res.json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const getProductById = (req, res) => {
    const { pid } = req.params;
    const products = readProducts();
    const product = products.find((p) => p.id === pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
};

const addProduct = (req, res) => {
    const { title, description, code, price, stock, category, thumbnails = [] } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
    }

    const products = readProducts();
    const newProduct = {
        id: `${Date.now()}`,
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails,
    };
    products.push(newProduct);
    writeProducts(products);

  // Emitir actualización de productos a los clientes
    req.io.emit('updateProducts', products);

    res.status(201).json(newProduct);
};

const deleteProduct = (req, res) => {
    const { pid } = req.params;
    const products = readProducts();
    const filteredProducts = products.filter((p) => p.id !== pid);

    if (products.length === filteredProducts.length) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    writeProducts(filteredProducts);
    req.io.emit('updateProducts', filteredProducts);
    res.status(204).send();
};

const updateProduct = (req, res) => {
    const { pid } = req.params;
    const updates = req.body;
    delete updates.id;

    const products = readProducts();
    const index = products.findIndex((p) => p.id === pid);
    if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });

    products[index] = { ...products[index], ...updates };
    writeProducts(products);
    res.json(products[index]);
};

module.exports = {
    readProducts,
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
};
