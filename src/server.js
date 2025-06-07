//------------------------------ Módulos Requeridos ------------------------------
const express = require("express");
const app = express(); //App actua como servidor
const http = require("http").createServer(app); // Crea el servidor Base
require("dotenv").config();

//Base de Datos
const mongoose = require("mongoose");

const { Server } = require("socket.io");
const io = new Server(http);

const handlebars = require("express-handlebars");
const path = require("path");

// Importar servicios y managers
const socketService = require("./services/socket.service");
const productManager = require("./managers/ProductsManager");
const cartsManager = require("./managers/CartsManager");

// Inicializar el servicio de WebSockets
socketService.init(io);

//----------------------------- Importación API  ------------------------------------------
const productsRouter = require("./routes/products.routes");
const cartsRouter = require("./routes/carts.routes");

//-------------------------------- Middlewares Globales --------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//----------------------------- Enrutamiento API y Vistas ------------------------------------------
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//-------------------------- Configuración de Handlebars ------------------------------------
app.engine(
  "hbs",
  handlebars.engine({
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    extname: ".hbs",
    defaultLayout: "main",
  })
);

app.set("views", path.join(__dirname, "/views")); // Declaramos que se implementa el main desde la carpeta views
app.set("views engine", "handlebars");
app.use(express.static(path.join(__dirname, "/views")));
app.use(express.static(path.join(__dirname, "public")));

//----------------------------- Ruta Principal "Home" con Handlebars -------------------------------

app.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1 // pagina por defecto es 1
    const limit = Number.parseInt(req.query.limit) || 6 // Limite por defecto

    if (page < 1 || limit < 1) {
      return res.status(400).send("Parámetros de página o límite inválidos.")
    }

    // Obtener productos Paginados y el total de items
    const productsFromDB = await productManager.getProducts(limit, page, undefined, undefined)

    // Convertimos de Documentos de MongoDB a objetos plantos, ya que en si Handlebars no logra acceder a los documentos de MongoDB
    const products = productsFromDB
      ? productsFromDB.map((product) => {
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


    // Calcular datos de paginaciin adicionales
    const totalPages = 4
    const prevPage = page > 1 ? page - 1 : null // null si es la primera página
    const nextPage = page < totalPages ? page + 1 : null // null si es la última página
    const isFirstPage = page === 1
    const isLastPage = page === totalPages

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
app.get("/realtimeproducts", async (req, res) => {
  const products = productManager.getProducts();
  //console.log(products);
  res.render("realTimeProducts.hbs", { products: products });
});

// ------------------------------ Configuracion de Mongoose ---------------------------------
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000, // Aumentar el tiempo de espera para la selección del servidor
      socketTimeoutMS: 45000, // Tiempo de espera para operaciones de socket
    });
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB Atlas:", error);

    console.log("Intentando reconectar en 5 segundos...");
    setTimeout(connectToMongoDB, 5000);
  }
};


connectToMongoDB()
module.exports = http;
