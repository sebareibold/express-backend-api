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
const productManager = require("./managers/ProductsManager");
productManager.setSocketManager(io);

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
  const products = productManager.getProducts();
  //console.log(products);
  res.render("index.hbs", { products: products });
});

//----------------------------- Ruta "Real Time Products" con Handlebars -------------------------------
app.get("/realtimeproducts", async (req, res) => {
  const products = productManager.getProducts();
  //console.log(products);
  res.render("realTimeProducts.hbs", { products: products });
});

// ----------------------------- Configuracion de Socket IO -------------------------------
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado :)");

  socket.on("disconnect", () => {
    console.log("Cliente Desconectado :(");
  });
});

// ------------------------------ Configuracion de Mongoose ---------------------------------
const enviroment = async () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Conectado a la base de datos de Mongo Atlas");
    })
    .catch((e) => {
      console.log("La conexión no se ha podido establecer correctamente:", e);
    });
};

enviroment();

module.exports = http;
