import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

export const renderProducts = async (req, res) => {
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
        const categories = await Product.distinct("category"); // Obtiene todas las categorías únicas
        const carts = await Cart.find().lean(); // Obtener todos los carritos para seleccionar uno

        res.render("products", {
            products: products.docs,
            totalPages: products.totalPages,
            prevPage: products.hasPrevPage ? products.prevPage : null,
            nextPage: products.hasNextPage ? products.nextPage : null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}&category=${category || ""}&sort=${sort || ""}` : null,
            nextLink: products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}&category=${category || ""}&sort=${sort || ""}` : null,
            selectedCategory: category || "",
            selectedSort: sort || "",
            categories, // Enviar la lista de categorías a la vista
            carts
        });
    } catch (error) {
        console.error("Error en renderProducts:", error);
        res.status(500).send("Error al cargar productos");
    }
};


export const renderCartsList = async (req, res) => {
    try {
        const carts = await Cart.find().lean();
        res.render('cartsList', { carts })
    } catch (error) {
        console.error("Error en renderCartList:", error);
        res.status(500).send("Error al cargar La lista de Carritos ");
    }
};

export const renderProductDetail = async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid).lean();
        if (!product) return res.status(404).send("Producto no encontrado");

        const carts = await Cart.find().lean();

        res.render('productDetail', { product, carts });
    } catch (error) {
        console.error("Error al cargar el producto:", error);
        res.status(500).send("Error al cargar el detalle del producto");
    }
}

export const renderCart = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Cart.findById(id).populate('products.product').lean();

        if (!cart) return res.status(404).send("Carrito no encontrado");

        res.render('carts', { title: 'Carrito', cartId: id, products: cart.products });
    } catch (error) {
        res.status(500).send("Error al cargar carrito");
    }
};

export const renderHome = async (req, res) => {
    res.render('home');
};
