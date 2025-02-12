import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, sort } = req.query;
        let query = {};

        if (category) query.category = category;

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
            lean: true
        };

        const products = await Product.paginate(query, options);
        const categories = await Product.distinct("category");

        res.render("products", {
            products: products.docs,
            totalPages: products.totalPages,
            prevPage: products.hasPrevPage ? products.prevPage : null,
            nextPage: products.hasNextPage ? products.nextPage : null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}` : null,
            nextLink: products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}` : null,
            selectedCategory: category || "",
            selectedSort: sort || "",
            categories
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

export const createProduct = async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error en createProduct:", error); 
        res.status(500).json({ error: error.message }); 
    }
};


export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener producto' });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};
