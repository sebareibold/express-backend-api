const express = require("express");
const router = express.Router();

const cartsManager = require("../managers/CartsManager");

// Rutas relacionadas a Carritos
router.get("/", async (req, res) => {
  try {
    const carts = cartsManager.getCarts();

    res.status(200).json({ success: true, carts });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const cartId = parseInt(pid);

    // Validacion (Fail-Fast): ID
    if (isNaN(cartId)) {
      return res.status(400).json({ 
        success: false,
        error: "ID de carrito inválido. Debe ser un número.",
      });
    }
    const cart = await cartsManager.getCart(cartId); 
    res.status(200).json({ success: true, cart });

  } catch (e) {
      if (e.message && e.message.includes("no encontrado")) {
        res.status(404).json({
            success: false,
            error: e.message
        });
    } else {
        res.status(500).json({ success: false, error: e.message });
    }
  }
});


router.post("/", async (req, res) => {
  try {
    const { products } = req.body;

    // Validacion (Fail-Fast): products
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ 
        success: false,
        error: "El cuerpo de la petición debe contener un array 'products'.",
      });
    }
    const newCart = await cartsManager.addCart(products); 
    res.status(201).json({ success: true, cart: newCart }); 

  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});


router.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const cartId = parseInt(pid);

    // Validacion (Fail-Fast 1): ID Carrito
    if (isNaN(cartId)) {
      return res.status(400).json({ 
        success: false,
        error: "ID de carrito inválido. Debe ser un número.",
      });
    }

    const { operacion, product } = req.body;

    // Validacion (Fail-Fast 2): Body y att de body 
    if (!req.body || !operacion || !product) {
      return res.status(400).json({
        success: false,
        error:
          "Cuerpo de la petición inválido. Faltan 'operacion' o 'product'.",
      });
    }

    // Validacion (Fail-Fast 3): Operacion
    if (operacion !== "agregar" && operacion !== "eliminar") {
      return res.status(400).json({ 
        success: false,
        error: "Operación inválida. Debe ser 'agregar' o 'eliminar'.",
      });
    }

    // Validacion (Fail-Fast 4): Producto 
    if (!product || typeof product.id === 'undefined') { 
      return res.status(400).json({ 
        success: false,
        error:
          "El objeto 'product' es inválido. Debe contener al menos un 'id'.",
      });
    }
      await cartsManager.updateCart(cartId, product, operacion); 

    res.status(200).json({
      success: true,
      message: `Carrito ${cartId} actualizado (${operacion} producto ${product.id}).`,
    });

  } catch (e) {
 if (e.message && e.message.includes("no encontrado")) { 
      res.status(404).json({ success: false, error: e.message }); 
    } else if (e.message && e.message.includes("inválid")) {
      res.status(400).json({ success: false, error: e.message });
    }
     else {
      res.status(500).json({ success: false, error: e.message });
    }
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const cartId = parseInt(pid);

    // Validacion (Fail-Fast): ID inválido 
    if (isNaN(cartId)) {
      return res.status(400).json({
        success: false,
        error: "ID de carrito inválido. Debe ser un número.",
      });
    }
    await cartsManager.deleteCart(cartId); 

    res.status(200).json({ success: true, message: `Carrito con ID ${cartId} eliminado.` });

  } catch (e) {
      if (e.message && e.message.includes("no encontrado")) { 
        res.status(404).json({
            success: false,
            error: e.message
        });
    } else {
        res.status(500).json({ success: false, error: e.message });
    }
  }
});
module.exports = router;