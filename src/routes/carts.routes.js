const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const cartsManager = require("../managers/CartsManager");

// Rutas relacionadas a Carritos
router.get("/", async (req, res) => {
  try {
    const carts = await cartsManager.getCarts();
    if (carts) {
      res.status(200).json({ success: true, carts: carts });
    } else {
      res.status(200).json({ success: true, carts: [] });
    }
  } catch (e) {
    console.error("Error al obtener carritos:", e);
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({
        success: false,
        error: "ID de carrito inválido.",
      });
    }

    const cart = await cartsManager.getCart(cid);

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Carrito no encontrado",
      });
    }

    res.status(200).json({ success: true, cart });
  } catch (e) {
    console.error("Error al obtener carrito:", e);
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { products } = req.body;

    const productsArray = products || [];
    
    if (!Array.isArray(productsArray)) {
      return res.status(400).json({
        success: false,
        error: "El campo 'products' debe ser un array.",
      });
    }

    const newCart = await cartsManager.addCart(productsArray);
    res.status(201).json({ success: true, cart: newCart });
  } catch (e) {
    console.error("Error al crear carrito:", e);
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const { quantity } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({
        success: false,
        error: "ID de carrito inválido.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({
        success: false,
        error: "ID de producto inválido.",
      });
    }

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({
        success: false,
        error: "El campo 'quantity' es requerido.",
      });
    }

    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: "El campo 'quantity' debe ser un número entero positivo.",
      });
    }

    const result = await cartsManager.updateCart(cid, pid, quantity);

    if (result) {
      res.status(200).json({
        success: true,
        message: "Producto agregado al carrito exitosamente.",
        cart: result
      });
    } else {
      res.status(400).json({
        success: false,
        error: "No se pudo agregar el producto al carrito.",
      });
    }
  } catch (e) {
    console.error("Error en POST /api/carts/:cid/product/:pid:", e);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor al agregar el producto al carrito.",
    });
  }
});

// Elimina un producto específico del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({
        success: false,
        error: "ID de carrito inválido.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({
        success: false,
        error: "ID de producto inválido.",
      });
    }

    const cartUpdated = await cartsManager.removeProductFromCart(cid, pid);

    if (cartUpdated) {
      res.status(200).json({ 
        success: true, 
        cart: cartUpdated,
        message: "Producto eliminado del carrito exitosamente."
      });
    } else {
      res.status(404).json({
        success: false,
        error: "No se pudo eliminar el producto del carrito.",
      });
    }
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reemplaza todos los productos del carrito
router.put("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const { products } = req.body;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({
        success: false,
        error: "ID de carrito inválido.",
      });
    }

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        error: "El cuerpo de la petición debe contener un array 'products'.",
      });
    }

    // Cambio: Validar estructura de productos
    for (const product of products) {
      if (!product.product || !mongoose.Types.ObjectId.isValid(product.product)) {
        return res.status(400).json({
          success: false,
          error: "Cada producto debe tener un ID válido en el campo 'product'.",
        });
      }
      if (!product.quantity || typeof product.quantity !== "number" || product.quantity <= 0) {
        return res.status(400).json({
          success: false,
          error: "Cada producto debe tener una cantidad válida.",
        });
      }
    }

    const cartUpdated = await cartsManager.updateCartWithNewProductList(cid, products);

    if (cartUpdated) {
      res.status(200).json({ 
        success: true, 
        cart: cartUpdated,
        message: "Carrito actualizado exitosamente."
      });
    } else {
      res.status(404).json({
        success: false,
        error: "No se pudo actualizar el carrito.",
      });
    }
  } catch (error) {
    console.error("Error al actualizar carrito:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Actualiza la cantidad de un producto específico
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body; 

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({
        success: false,
        error: "ID de carrito inválido.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({
        success: false,
        error: "ID de producto inválido.",
      });
    }

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({
        success: false,
        error: "El campo 'quantity' es requerido.",
      });
    }

    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: "La cantidad debe ser un número entero positivo.",
      });
    }

    const cartUpdated = await cartsManager.updateCartMoreQuantifyOfProduct(cid, pid, quantity);

    if (cartUpdated) {
      res.status(200).json({ 
        success: true, 
        cart: cartUpdated,
        message: "Cantidad del producto actualizada exitosamente."
      });
    } else {
      res.status(404).json({
        success: false,
        error: "No se pudo actualizar la cantidad del producto.",
      });
    }
  } catch (error) {
    console.error("Error al actualizar cantidad del producto:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Vacía todos los productos del carrito (pero mantiene el carrito)
router.delete("/:cid/products", async (req, res) => {
  try {
    const cid = req.params.cid;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({
        success: false,
        error: "ID de carrito inválido.",
      });
    }

    const cartUpdated = await cartsManager.emptyCart(cid);

    if (cartUpdated) {
      res.status(200).json({ 
        success: true, 
        cart: cartUpdated,
        message: "Carrito vaciado exitosamente."
      });
    } else {
      res.status(404).json({
        success: false,
        error: "No se pudo vaciar el carrito.",
      });
    }
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Elimina completamente el carrito
router.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({
        success: false,
        error: "ID de carrito inválido.",
      });
    }

    const successDelete = await cartsManager.deleteCart(cid); 

    if (successDelete) {
      res.status(200).json({ 
        success: true, 
        message: `Carrito con ID ${cid} eliminado exitosamente.`
      });
    } else {
      res.status(404).json({
        success: false,
        error: `Carrito con ID ${cid} no encontrado o no se pudo eliminar.`,
      });
    }
  } catch (e) {
    console.error("Error al eliminar carrito:", e);
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;