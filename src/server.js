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
  }),
)

app.set("views", path.join(__dirname, "/views")); // Declaramos que se implementa el main desde la carpeta views
app.set("views engine", "handlebars");
app.use(express.static(path.join(__dirname, "/views")));
app.use(express.static(path.join(__dirname, "public")));

//----------------------------- Ruta Principal "Home" con Handlebars -------------------------------
app.get("/", async (req, res) => {
  const products = productManager.getProducts();
  res.render("index.hbs", { products: products });
})

//----------------------------- Ruta "Real Time Products" con Handlebars -------------------------------
app.get("/realtimeproducts", async (req, res) => {
  const products = productManager.getProducts();
  //console.log(products);
  res.render("realTimeProducts.hbs", { products: products });
})

// ------------------------------ Configuracion de Mongoose ---------------------------------
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000, // Aumentar el tiempo de espera para la selección del servidor
      socketTimeoutMS: 45000, // Tiempo de espera para operaciones de socket
    })
    console.log("✅ Conectado exitosamente a MongoDB Atlas");
    
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB Atlas:", error);

    console.log("Intentando reconectar en 5 segundos...");
    setTimeout(connectToMongoDB, 5000);
  }
}

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB desconectado, intentando reconectar...");
  setTimeout(connectToMongoDB, 5000);
})

// Iniciar la conexión a MongoDB
connectToMongoDB()
module.exports = http
