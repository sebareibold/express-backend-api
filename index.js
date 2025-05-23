const http = require("./src/server.js");
const PORT = 8080; //Se usa comunmente el puerto 8080 en produccion

async function main() {
  try {
    const cartsManagerInstance = require("./src/managers/CartsManager.js");
    const productsManagerInstance = require("./src/managers/ProductsManager.js");

    await cartsManagerInstance.init();
    await productsManagerInstance.init();

    console.log(
      "CartsManager y ProductsManager inicializado correctamente. Datos cargados."
    );

    http.listen(PORT, () => {
      console.log(`Server Escuchando en el puerto: http://localhost:${PORT}`);
    });
    
  } catch (e) {
    console.error("Error al iniciar la aplicación:", e);
    process.exit(1);
  }
}

main();
