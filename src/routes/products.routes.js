const express = require("express")
const mongoose = require("mongoose") // Import mongoose to use ObjectId
const router = express.Router()
const productManager = require("../managers/ProductsManager")
// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, category, code, stock, status, price, title, description } = req.query

    // Validaciones y conversiones
    const finalLimit = limit && !isNaN(Number.parseInt(limit)) ? Number.parseInt(limit) : 10
    const finalPage = page && !isNaN(Number.parseInt(page)) ? Number.parseInt(page) : 1
    const finalSort = typeof sort === "string" ? sort : undefined

    // Validar parámetros numéricos
    if ((limit && isNaN(limit)) || (page && isNaN(page)) || (stock && isNaN(stock)) || (price && isNaN(price))) {
      return res.status(400).json({
        status: "error",
        message: "Uno o más parámetros numéricos son inválidos.",
      })
    }

    // Construcción dinámica del objeto de búsqueda
    const query = {}
    if (category) query.category = category
    if (code) query.code = code
    if (stock) query.stock = Number.parseInt(stock)
    if (status !== undefined) query.status = status === "true"
    if (price) query.price = Number.parseFloat(price)
    if (title) query.title = title
    if (description) query.description = description

    const result = await productManager.getProducts(finalLimit, finalPage, finalSort, query)

    // Responder con el formato requerido por la consigna
    if (result.status === "error") {
      return res.status(500).json(result)
    }

    res.status(200).json({
      status: "success",
      payload: result.payload,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevLink,
      nextLink: result.nextLink,
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor.",
      error: error.message,
    })
  }
})

// Obtener producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid

    const prod = await productManager.getProductById(pid)
    if (prod) {
      res.status(200).json({ success: true, product: prod })
    } else {
      res.status(404).json({ success: false, error: "Producto no encontrado" })
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message })
  }
})
// Crear nuevo producto
router.post("/", async (req, res) => {
  try {
    const { title, price, stock, code, category, description, status, thumbnails } = req.body

    if (!title || !price || !stock || !code || !category || !description || !status || !thumbnails) {
      return res.status(400).json({
        success: false,
        error: "El cuerpo de la petición debe contener att correctos",
      })
    }
    const newProd = await productManager.addProduct(
      title,
      description,
      price,
      category,
      code,
      stock,
      status,
      thumbnails,
    )

    res.status(201).json({ success: true, producto: newProd })
  } catch (e) {
    if (e.message && e.message.includes("no encontrado")) {
      res.status(404).json({
        success: false,
        error: e.message,
      })
    } else {
      res.status(500).json({ success: false, error: e.message })
    }
  }
})

router.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid

    // Verificar si el ID es un ObjectId válido de MongoDB
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({
        success: false,
        error: "ID de producto inválido.",
      })
    }

    const { valor, campo } = req.body
    const campos = ["title", "price", "stock", "category", "description", "code"]

    if (!valor || !campos.includes(campo)) {
      return res.status(400).json({
        success: false,
        error: "El cuerpo de la petición debe contener un campo válido (title, price, etc.) y un valor.",
      })
    }

    const exito = await productManager.updateProduct(pid, campo, valor)
    if (exito) {
      res.status(200).json({ success: true, message: "Actualizacion Exitosa" })
    } else {
      return res.status(400).json({
        success: false,
        error: "Error en la actualizacion, verificar body.)",
      })
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message })
  }
})

router.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid
    const productId = Number.parseInt(pid)

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        error: "ID de prodcuto inválido. Debe ser un número.",
      })
    }
    const exito = await productManager.deleteProduct(productId)
    if (exito) {
      res.status(200).json({ success: true, message: "Exito en la eliminacion" })
    } else {
      res.status(200).json({
        success: true,
        error: "Error en la eliminacion, verificar body.)",
      })
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message })
  }
})

module.exports = router
