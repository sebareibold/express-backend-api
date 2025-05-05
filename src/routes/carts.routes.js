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

router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cartId = parseInt(cid);

    // Validacion (Fail-Fast)
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
        error: e.message,
      });
    } else {
      res.status(500).json({ success: false, error: e.message });
    }
  }
});

router.post("/", async (req, res) => {
  try {
    const { products } = req.body;

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


router.post("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;  
  const cartId = parseInt(cid);  

  const pid = req.params.pid;
  const prodId = parseInt(pid);

  const { quantity } = req.body;

  try {
    if (isNaN(cartId) || cartId === "") {
      return res.status(400).json({
        success: false,
        error: "ID de carrito inválido o faltante en los parámetros.",
      });
    }

    if (isNaN(prodId) || prodId === "") {
      return res.status(400).json({
        success: false,
        error: "ID de producto inválido o faltante en los parámetros.",
      });
    }

    if (
      quantity === undefined ||
      typeof quantity !== "number" ||
      quantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "El cuerpo de la petición debe contener 'quantity' como un número positivo.",
      });
    }
    await cartsManager.updateCart(cartId, prodId, quantity);
    res.status(200).json({
      success: true,
      message: "Producto agregado al carrito exitosamente.",
    });

  } catch (e) {
    console.error("Error en POST /api/carts/:cid/product/:pid:", e);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor al agregar el producto al carrito.",
    });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cartId = parseInt(cid);

    if (isNaN(cartId)) {
      return res.status(400).json({
        success: false,
        error: "ID de carrito inválido. Debe ser un número.",
      });
    }
    await cartsManager.deleteCart(cartId);

    res
      .status(200)
      .json({ success: true, message: `Carrito con ID ${cartId} eliminado.` });
  } catch (e) {
    if (e.message && e.message.includes("no encontrado")) {
      res.status(404).json({
        success: false,
        error: e.message,
      });
    } else {
      res.status(500).json({ success: false, error: e.message });
    }
  }
});
module.exports = router;
