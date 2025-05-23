//------------------------------ Módulos Requeridos ------------------------------
const express = require("express");
const app = express(); //App actua como servidor
const http = require("http").createServer(app);
//const io = require(Socket.io)(http);

const handlebars = require("express-handlebars");
const path = require("path");
const productManager = require("./managers/ProductsManager");

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
    partialsDir: path.join(__dirname, "views/partials"), // ¡Esta es la clave!
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
  console.log("Nuevo cliente conectado!");

  // Escuchar el evento de "agregar producto" desde el cliente
  socket.on("productListUpdate", () => {
    console.log("Notificacion de Actualizacion Recibida");
    const products = productManager.getProducts();
  });

});

//*/
module.exports = app;

/*

En si su rol es actuar como un archivo configurador, donde se crea la aplicacion de Express,
se configura los MIddlewares globales, como los datos .sjon, las rutas, etc. Y se exporta la 
app para q la use el index

*/
