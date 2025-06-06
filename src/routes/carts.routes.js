const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const cartsManager = require("../managers/CartsManager");

// Rutas relacionadas a Carritos
router.get("/", async (req, res) => {
  try {
    const carts = await cartsManager.getCarts();
    if (carts) {
      //console.log("Cart",carts);
      res.status(200).json({ success: true, carts: carts });
    } else {
      console.log("Error al obtener cart desde MongoDB");
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;

    // Validacion usando ObjectId en lugar de parseInt
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
    res.status(500).json({ success: false, error: e.message });
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
  const pid = req.params.pid;
  const { quantity } = req.body;

  try {
    // Validar ObjectIds
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

    const result = await cartsManager.updateCart(cid, pid, quantity);

    if (result) {
      res.status(200).json({
        success: true,
        message: "Producto agregado al carrito exitosamente.",
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

router.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({
        success: false,
        error: "ID de carrito inválido.",
      });
    }

    await cartsManager.deleteCart(cid);

    res
      .status(200)
      .json({ success: true, message: `Carrito con ID ${cid} eliminado.` });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
module.exports = router;
