const fs = require('fs');
const path = require('path');
const productsFilePath = path.join(__dirname, '../data/productos.json');

// Leer productos
const readProducts = () => {
  const data = fs.readFileSync(productsFilePath, 'utf-8');
  return JSON.parse(data);
};

// Escribir productos
const writeProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// Obtener todos los productos
const getProducts = (req, res) => {
  const { limit } = req.query;
  const products = readProducts();
  if (limit) {
    return res.json(products.slice(0, parseInt(limit)));
  }
  res.json(products);
};

// Obtener producto por ID
const getProductById = (req, res) => {
  const { pid } = req.params;
  const products = readProducts();
  const product = products.find((p) => p.id === pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
};

// Agregar producto
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

// Eliminar producto
const deleteProduct = (req, res) => {
  const { pid } = req.params;
  const products = readProducts();
  const filteredProducts = products.filter((p) => p.id !== pid);

  if (products.length === filteredProducts.length) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  writeProducts(filteredProducts);

  // Emitir actualización de productos a los clientes
  req.io.emit('updateProducts', filteredProducts);

  res.status(204).send();
};

// Actualizar producto
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
