const express = require("express");
const router = express.Router();
const productManager = require("../managers/ProductsManager");

// Rutas relacionadas a Carritos
router.get("/", async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "GET todos los productos" });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "GET todos los productos" });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post("/:pid", async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "GET todos los productos" });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "GET todos los productos" });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "GET todos los productos" });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
