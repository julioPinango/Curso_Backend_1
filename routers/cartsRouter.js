import { Router } from "express";
import { CartController } from "../controllers/cartsController.js";

const router = Router();

router.post("/", CartController.createCart); // Crear un carrito
router.get("/:cid", CartController.getCart); // Obtener carrito por ID
router.post("/:cid/product/:pid", CartController.addProductToCart); // Agregar producto al carrito
router.delete("/:cid/product/:pid", CartController.removeProductFromCart); // Eliminar producto del carrito
router.delete("/:cid", CartController.clearCart); // Vaciar carrito

export default router;
