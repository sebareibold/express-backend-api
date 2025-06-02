// Servicio para manejar WebSockets
class SocketService {
  constructor() {
    this.io = null
  }

  // Inicializar el servicio con la instancia de Socket.io
  init(io) {
    if (this.io) {
      console.log("Socket service ya fue inicializado")
      return
    }

    this.io = io

    // Configurar eventos de conexión
    this.io.on("connection", (socket) => {
      console.log("Nuevo cliente conectado :)")

      socket.on("disconnect", () => {
        console.log("Cliente Desconectado :(")
      })
    })

    console.log("Socket service inicializado correctamente")
  }

  // Método para emitir actualizaciones de productos
  emitProductUpdate(products) {
    if (!this.io) {
      console.log("Socket service no inicializado")
      return
    }

    this.io.emit("productListUpdate", products)
    console.log("Socket emitió actualización de productos")
  }
}

// Singleton para usar en toda la aplicación
const socketService = new SocketService()
module.exports = socketService
