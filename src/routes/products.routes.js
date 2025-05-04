const express = require("express");
const router = express.Router();
const productManager = require("../managers/ProductsManager");

// Rutas relacionadas a Carritos
router.get("/", async (req, res) => {
  try {
    const products = productManager.getProducts();

    res.status(200).json({ success: true, products });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const productId = parseInt(pid);

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        error: "ID de prodcuto inválido. Debe ser un número.",
      });
    }
    const prod = await productManager.getProductById(productId);
    res.status(200).json({ success: true, prod });
  } catch (e) {
    //Vemos si el error es de route o managers
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

router.post("/:pid", async (req, res) => {
  const { id, name, price, stock, category, description } = req.body;

  if (!id || !name || !price || !stock || !category || !description) {
    return res.status(400).json({
      success: false,
      error: "El cuerpo de la petición debe contener att correctos",
    });
  }
  const newProd = await productManager.addProduct(
    id,
    name,
    price,
    stock,
    category,
    description
  );
  try {
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

    if (
      !valor ||
      campo !== "name" ||
      campo !== "price" ||
      campo !== "stock" ||
      campo !== "category" ||
      campo !== "description"
    ) {
      return res.status(400).json({
        success: false,
        error:
          "El cuerpo de la petición debe contener el body correcto (formato)",
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
      res
        .status(200)
        .json({
          success: true,
          error: "Error en la eliminacion, verificar body.)",
        });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
