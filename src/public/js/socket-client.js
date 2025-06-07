// Importar la biblioteca Socket.IO
const io = require("socket.io-client")

// Cliente de WebSockets para la actualización en tiempo real de productos
const socket = io()

// Función para actualizar la lista de productos en la UI
function updateProductList(products) {
  console.log("Productos actualizados recibidos:", products)

  const container = document.getElementById("productList")
  if (!container) return

  container.innerHTML = "<h1> Lista de Productos de la Base de Datos</h1>"

  // Agregar productos dinámicamente
  products.forEach((product) => {
    container.innerHTML += `
      <div class="product-item">
        <p>Id: ${product.id}</p>
        <p>Título: ${product.title}</p>
        <p>Descripción: ${product.description}</p>
        <p>Precio: $${product.price}</p>
        <p>Categoría: ${product.category}</p>
        <p>Código: ${product.code}</p>
        <p>Stock: ${product.stock}</p>
        <hr />
      </div>
    `
  })
}

// Escuchar eventos de actualización de productos
socket.on("productListUpdate", updateProductList)


