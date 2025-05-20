const express = require("express");
const app = express(); //App actua como servidor

const handlebars = require("express-handlebars");
const path = require("path");
const productManager = require("./managers/ProductsManager");

/*--------------------------- Seteo Handlebar ----------------------------- */
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);

app.set("views", path.join(__dirname, "/views")); // Declaramos que se implementa el main desde la carpeta views
app.set("views engine", "handlebars");
app.use(express.static(path.join(__dirname, "/views")));
app.use(express.static(path.join(__dirname, "public")));

/*--------------------------- Importamos Rutas ----------------------------- */
const productsRouter = require("./routes/products.routes");
const cartsRouter = require("./routes/carts.routes");

/*----------------------------- Middlewares ----------------------------- */
app.use(express.json()); //Recibir datos por body {}
app.use(express.urlencoded({ extended: true })); //Data por From

app.use("/api/products", productsRouter); // Uso de rutas de productos
app.use("/api/carts", cartsRouter); // Uso de rutas de carritos

/*----------------------------- Home con Handlebars ----------------------------- */
app.get("/", async (req, res) => {
  const products = productManager.getProducts();
  //console.log(products);
  res.render("index.hbs", { products: products });
});

module.exports = app;

/*
    
    En si su rol es actuar como un archivo configurador, donde se crea la aplicacion de Express,
    se configura los MIddlewares globales, como los datos .sjon, las rutas, etc. Y se exporta la 
    app para q la use el index

*/
