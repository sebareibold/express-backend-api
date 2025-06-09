// Servicio para manejar WebSockets
class SocketService {
  constructor() {
    this.io = null
  }

  // Inicializar el servicio con la instancia de Socket.io
  init(io) {
    if (this.io) {
      console.log("✅ Socket service ya fue inicializado")
      return
    }

    this.io = io

    this.io.on("connection", (socket) => {
      console.log(`🔌 Nuevo Cliente conectado, Id:  ${socket.id}`)

      // Enviar productos actuales al cliente recién conectado
      this.sendCurrentProducts(socket)

      // Manejar actualización de producto desde cliente
      socket.on("updateProduct", async (productData) => {
        try {
          // Aquí podrías permitir actualizaciones desde el cliente
          console.log("Solicitud de actualización de producto:", productData)
          // Validar permisos, actualizar producto, etc.
        } catch (error) {
          this.handleSocketError(socket, error, "updateProduct")
        }
      })

      socket.on("disconnect", (reason) => {
        console.log(`🔌 Cliente desconectado: ${socket.id}, razón: ${reason}`)
      })

      socket.on("error", (error) => {
        this.handleSocketError(socket, error, "general")
      })

      socket.on("requestProducts", async () => {
        try {
          console.log(`Cliente ${socket.id} solicita productos actuales`)
          await this.sendCurrentProducts(socket)
        } catch (error) {
          console.error("Error al enviar productos solicitados:", error)
        }
      })
    })

    console.log("✅ Socket Service inicializado exitosamente!")
  }

  // Enviar productos actuales a un cliente específico
  async sendCurrentProducts(socket) {
    try {
      const productManager = require("../managers/ProductsManager")
      const result = await productManager.getProducts(50, 1) // Obtener más productos para tiempo real

      // Extraer solo el array de productos del resultado
      const products = result.payload || []

      socket.emit("productListUpdate", products)
      console.log(`📦 Productos enviados al cliente Id: ${socket.id}`)
    } catch (error) {
      console.error("Error al enviar productos actuales:", error)
    }
  }

  // Método para emitir actualizaciones de productos
  emitProductUpdate(result) {
    if (!this.io) {
      console.log("❌ Socket service no inicializado")
      return
    }

    // Extraer solo el array de productos del resultado
    const products = result.payload || []

    this.io.emit("productListUpdate", products)
    console.log(`📡 Actualización de productos emitida a ${this.io.engine.clientsCount} clientes`)
  }

  // Obtener número de clientes conectados
  getConnectedClients() {
    return this.io ? this.io.engine.clientsCount : 0
  }

  // Método para manejar errores de socket
  handleSocketError(socket, error, context = "") {
    console.error(`❌ Error en socket ${socket.id} ${context}:`, error)
    socket.emit("error", {
      message: "Ha ocurrido un error",
      context: context,
      timestamp: new Date().toISOString(),
    })
  }

  // Método para enviar notificaciones generales
  emitNotification(message, type = "info") {
    if (!this.io) return

    this.io.emit("notification", {
      message,
      type, // 'success', 'error', 'warning', 'info'
      timestamp: new Date().toISOString(),
    })
  }
}

// Singleton para usar en toda la aplicación
const socketService = new SocketService()
module.exports = socketService
