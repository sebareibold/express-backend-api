const express = require("express");
const router = express.Router();
const productManager = require("../managers/ProductsManager");

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const products = productManager.getProducts();

    res.status(200).json({ success: true, products });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Obtener producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const prod = await productManager.getProductById(pid);
    if (prod) {
      res.status(200).json({ success: true, product:prod });
    } else {
      res.status(404).json({ success: false, error: "Producto no encontrado" });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
// Crear nuevo producto
router.post("/", async (req, res) => {
  try {
    const {
      title,
      price,
      stock,
      code,
      category,
      description,
      status,
      thumbnails,
    } = req.body;

    if (
      !title ||
      !price ||
      !stock ||
      !code ||
      !category ||
      !description ||
      !status ||
      !thumbnails
    ) {
      return res.status(400).json({
        success: false,
        error: "El cuerpo de la petición debe contener att correctos",
      });
    }
    const newProd = await productManager.addProduct(
      title,
      description,
      price,
      category,
      code,
      stock,
      status,
      thumbnails
    );

    res.status(201).json({ success: true, producto: newProd });
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

router.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const productId = parseInt(pid);

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        error: "ID de prodcuto inválido. Debe ser un número.",
      });
    }

    const { valor, campo } = req.body;
    const campos = [
      "title",
      "price",
      "stock",
      "category",
      "description",
      "code",
    ];

    if (!valor || !campos.includes(campo)) {
      return res.status(400).json({
        success: false,
        error:
          "El cuerpo de la petición debe contener un campo válido (title, price, etc.) y un valor.",
      });
    }

    const exito = await productManager.updateProduct(productId, campo, valor);
    if (exito) {
      res.status(200).json({ success: true, message: "Actualizacion Exitosa" });
    } else {
      return res.status(400).json({
        success: false,
        error: "Error en la actualizacion, verificar body.)",
      });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const productId = parseInt(pid);

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        error: "ID de prodcuto inválido. Debe ser un número.",
      });
    }
    const exito = await productManager.deleteProduct(productId);
    if (exito) {
      res
        .status(200)
        .json({ success: true, message: "Exito en la eliminacion" });
    } else {
      res.status(200).json({
        success: true,
        error: "Error en la eliminacion, verificar body.)",
      });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
