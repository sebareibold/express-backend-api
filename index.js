// Punto de entrada principal del servidor
const http = require("./src/server");
const productManager = require("./src//managers/ProductsManager");
const cartsManager = require("./src//managers/CartsManager");
const mongoose = require("mongoose");

// Puerto del servidor
const PORT = process.env.PORT || 8080;

// Función para inicializar el servidor
const initializeServer = async () => {
  try {
    // Inicializar managers
    await productManager.init();
    await cartsManager.init();

    // Iniciar el servidor HTTP
    http.listen(PORT, () => {
      console.log("=".repeat(50));

      console.log("🚀 ¡Servidor iniciado exitosamente!");
      console.log(`📡 Puerto: ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`🛍️  Productos: http://localhost:${PORT}/`);
      console.log(`⚡ Tiempo real: http://localhost:${PORT}/realtimeproducts`);
      console.log(`📋 API Productos: http://localhost:${PORT}/api/products`);
      console.log(`🛒 API Carritos: http://localhost:${PORT}/api/carts`);
      console.log("=".repeat(50));
    });
  } catch (error) {
    console.error("❌ Error al inicializar el servidor:", error);
    process.exit(1);
  }
};

// Manejar la conexión a MongoDB
mongoose.connection.once("open", () => {
  console.log("✅ MongoDB Conectado Exitosamente!");
  initializeServer();
});

mongoose.connection.on("error", (error) => {
  console.error("❌ Error de conexión a MongoDB:", error);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB desconectado");
});
