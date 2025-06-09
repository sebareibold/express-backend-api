//------------------------------ Módulos Requeridos ------------------------------
const express = require("express")
const app = express() //App actua como servidor
const http = require("http").createServer(app) // Crea el servidor Base
require("dotenv").config()

//Base de Datos
const mongoose = require("mongoose")

const { Server } = require("socket.io")
const io = new Server(http)

const handlebars = require("express-handlebars")
const path = require("path")

// Importar servicios y managers
const socketService = require("./services/socket.service")
const productManager = require("./managers/ProductsManager")
const cartsManager = require("./managers/CartsManager")

// Inicializar el servicio de WebSockets
socketService.init(io)

//----------------------------- Importación API  ------------------------------------------
const productsRouter = require("./routes/products.routes")
const cartsRouter = require("./routes/carts.routes")

//-------------------------------- Middlewares Globales --------------------------------------------
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//-------------------------- Configuración de Handlebars ------------------------------------
app.engine(
  "hbs",
  handlebars.engine({
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      multiply: (a, b) => (a * b).toFixed(2),
      calculateTotal: (products) => {
        if (!products || !Array.isArray(products)) return "0.00"
        const total = products.reduce((sum, item) => {
          return sum + item.productId.price * item.quantity
        }, 0)
        return total.toFixed(2)
      },
      eq: (a, b) => a === b,
    },
  }),
)

app.set("views", path.join(__dirname, "/views")) // Declaramos que se implementa el main desde la carpeta views
app.set("views engine", "hbs")
app.use(express.static(path.join(__dirname, "/views")))
app.use(express.static(path.join(__dirname, "public")))

//----------------------------- Ruta para producto individual -------------------------------
app.get("/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid
    const product = await productManager.getProductById(pid)

    if (!product) {
      return res.status(404).render("product-detail.hbs", {
        product: null,
        title: "Producto no encontrado",
      })
    }

    // Convertir a objeto plano para Handlebars
    const plainProduct = product.toObject ? product.toObject() : product

    res.render("product-detail.hbs", {
      product: plainProduct,
      title: plainProduct.title,
    })
  } catch (error) {
    console.error("Error al obtener producto:", error)
    res.status(500).render("product-detail.hbs", {
      product: null,
      title: "Error del servidor",
    })
  }
})

//----------------------------- Ruta para carrito específico -------------------------------
app.get("/carts/:cid", async (req, res) => {
  try {
    const cid = req.params.cid
    const cart = await cartsManager.getCart(cid)

    if (!cart) {
      return res.status(404).render("cart-detail.hbs", {
        cart: null,
        title: "Carrito no encontrado",
      })
    }

    // Convertir a objeto plano para Handlebars
    const plainCart = cart.toObject ? cart.toObject() : cart

    res.render("cart-detail.hbs", {
      cart: plainCart,
      title: "Mi Carrito",
    })
  } catch (error) {
    console.error("Error al obtener carrito:", error)
    res.status(500).render("cart-detail.hbs", {
      cart: null,
      title: "Error del servidor",
    })
  }
})

//----------------------------- Enrutamiento API y Vistas ------------------------------------------
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

//----------------------------- Ruta Principal "Home" con Handlebars -------------------------------

app.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1 // pagina por defecto es 1
    const limit = Number.parseInt(req.query.limit) || 6 // Limite por defecto

    if (page < 1 || limit < 1) {
      return res.status(400).send("Parámetros de página o límite inválidos.")
    }

    // Obtener productos Paginados y el total de items
    const result = await productManager.getProducts(limit, page, undefined, undefined)

    // Convertimos de Documentos de MongoDB a objetos plantos
    const products =
      result.payload && Array.isArray(result.payload)
        ? result.payload.map((product) => {
            const plainProduct = product.toObject ? product.toObject() : product
            return {
              _id: plainProduct._id,
              title: plainProduct.title,
              description: plainProduct.description,
              price: plainProduct.price,
              category: plainProduct.category,
              code: plainProduct.code,
              stock: plainProduct.stock,
              status: plainProduct.status,
              thumbnails: plainProduct.thumbnails,
            }
          })
        : []

    // Usar la información de paginación del resultado
    const totalPages = result.totalPages || 4
    const prevPage = result.prevPage
    const nextPage = result.nextPage
    const isFirstPage = !result.hasPrevPage
    const isLastPage = !result.hasNextPage

    // Generar array para los numeros de pagina
    const pagesArray = []
    for (let i = 1; i <= totalPages; i++) {
      pagesArray.push({
        number: i,
        isCurrent: i === page,
      })
    }

    // Renderizar el template pasando los datos necesarios
    res.render("index.hbs", {
      products,
      currentPage: page,
      totalPages,
      prevPage,
      nextPage,
      isFirstPage,
      isLastPage,
      pagesArray,
    })
  } catch (error) {
    console.error("Error al obtener productos paginados:", error)
    res.status(500).send("Error interno del servidor")
  }
})

//----------------------------- Ruta "Real Time Products" con Handlebars -------------------------------
//----------------------------- Ruta "Real Time Products" con Handlebars -------------------------------
app.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realTimeProducts.hbs", {
      products: [], // Vacío inicialmente
      title: "Productos en Tiempo Real",
    })
  } catch (error) {
    console.error("Error al renderizar realTimeProducts:", error)
    res.render("realTimeProducts.hbs", { products: [] })
  }
})

// ------------------------------ Configuracion de Mongoose ---------------------------------
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000, // Aumentar el tiempo de espera para la selección del servidor
      socketTimeoutMS: 45000, // Tiempo de espera para operaciones de socket
    })
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB Atlas:", error)

    console.log("Intentando reconectar en 5 segundos...")
    setTimeout(connectToMongoDB, 5000)
  }
}

connectToMongoDB()
module.exports = http
