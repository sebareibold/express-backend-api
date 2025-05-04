const express = require("express");
const app = express(); //App actua como servidor

/*----------------------------- Importamos Rutas ----------------------------- */
const productsRouter = require("./routes/products.routes");
const cartsRouter = require("./routes/carts.routes");

/*----------------------------- Middlewares ----------------------------- */
app.use(express.json()); //Recibir datos por body {}
app.use(express.urlencoded({ extended: true })); //Data por From

app.use("/api/products", productsRouter); // Uso de rutas de productos
app.use("/api/carts", cartsRouter); // Uso de rutas de carritos

/*----------------------------- Bienvenida ----------------------------- */
app.get("/", async (req, res) => {
  res.send(`
        <h1>¡Bienvenido a mi primera APIRest!</h1>
        <h4>Podes ver productos :) y Carritos :)</h4>

        <p>Productos con: /api/products/  </p>
        <p>Carritos con: /api/carts/  </p>

        
    `);
});

module.exports = app;

/*
    En si su rol es actuar como un archivo configurador, donde se crea la aplicacion de Express,
    se configura los MIddlewares globales, como los datos .sjon, las rutas, etc. Y se exporta la 
    app para q la use el index
*/
