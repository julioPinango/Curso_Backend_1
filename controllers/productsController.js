import Product from '../models/Product.js';

// Obtener todos los productos con filtros y paginación
export const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, sort } = req.query;
        const query = category ? { category } : {};

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
        };

        const products = await Product.paginate(query, options);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear producto' });
    }
};
