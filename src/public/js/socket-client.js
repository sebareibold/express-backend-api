// ✅ CORRECTO: Socket.IO ya está cargado desde el script anterior

const io = window.io // Declare the io variable
const socket = io() // Esto conecta automáticamente al servidor

// Función para actualizar la lista de productos en la UI
function updateProductList(products) {
  console.log("Productos actualizados recibidos:", products)

  const container = document.getElementById("productList")
  if (!container) return

  // Limpiar contenido anterior pero mantener el título
  container.innerHTML = "<h1>Lista de Productos de la Base de Datos (Tiempo Real)</h1>"

  // Si no hay productos
  if (!products || products.length === 0) {
    container.innerHTML += "<p>No hay productos disponibles</p>"
    return
  }

  // Agregar productos dinámicamente
  products.forEach((product) => {
    container.innerHTML += `
      <div class="product-item">
        <p>Id: ${product._id}</p>
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

// Eventos de conexión para debugging
socket.on("connect", () => {
  console.log("✅ Conectado al servidor WebSocket")
  console.log("Socket ID:", socket.id)
})

socket.on("disconnect", () => {
  console.log("❌ Desconectado del servidor WebSocket")
})

socket.on("connect_error", (error) => {
  console.error("❌ Error de conexión WebSocket:", error)
})

// Evento para manejar errores del servidor
socket.on("error", (errorData) => {
  console.error("❌ Error del servidor:", errorData)
})
