const mongoose = require("mongoose")
const CartSchema = require("../models/CartSchema")
const socketService = require("../services/socket.service")

class CartsManager {
  constructor() {}

  async init() {
    try {
      console.log("ProductsManager inicializado para MongoDB")
    } catch (error) {
      console.error("Error al leer el archivo de carts:", error.message)
      //this.carts = [];
    }
  }

  async getCarts() {
    try {
      const carts = await CartSchema.find()
      return carts
    } catch (error) {
      console.error("Error al obtener cart:", error.message)
      return []
    }
  }

  async getCart(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("Error: ID de cart inválido")
        return null
      }
      const cart = await CartSchema.findById(id) // Cambiar find por findById

      if (cart) {
        console.log("Éxito: Cart encontrado")
      } else {
        console.log("Error: Cart no encontrado")
      }
      return cart
    } catch (error) {
      console.error("Error al buscar Cart por ID:", error.message)
      return null
    }
  }

  async addCart(products) {
    try {
      // Verificamos q no este vacio
      if (!products || products.length == 0) {
        throw new Error(`Carrito Vacio`)
      }
      //Creamos el esquema con los datos, y lo guardamos en la col.
      const newCart = new CartSchema({ products: products }) // Pasar como objeto con propiedad products
      const saveCart = await newCart.save()

      console.log("Cart añadido:", newCart)

      return saveCart
    } catch (error) {
      console.error("Error", error.message)
      throw error // Re-lanzar el error para que sea manejado por la ruta
    }
  }

  async deleteCart(id) {
    try {
      // Verificar si el ID es válido
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("Error: ID de Cart inválido")
        return 0
      }
      const deleteCart = await CartSchema.findByIdAndDelete(id)
      if (deleteCart) {
        console.log(`Cart con ID ${id} eliminado.`)
      } else {
        console.log(`ERROR: Cart con ID ${id} NO eliminado.`)
      }
    } catch (error) {
      console.error("Error al eliminar cart:", error.message)
    }
  }

  async updateCart(cartId, productId, quantity) {
    try {
      // Validaciones
      if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
        console.error("Error: IDs inválidos.")
        return false
      }

      if (typeof quantity !== "number" || quantity <= 0) {
        console.error("Error: La cantidad debe ser un número positivo.")
        return false
      }

      // Buscar el carrito por ID
      const cart = await CartSchema.findById(cartId)
      if (!cart) {
        console.log(`Error: Carrito con ID ${cartId} no encontrado.`)
        return false
      }

      // Buscar si el producto ya existe en el carrito
      const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId)

      if (productIndex === -1) {
        // Si no existe, agregarlo
        cart.products.push({ productId, quantity })
        console.log(`Producto ${productId} añadido al carrito ${cartId}. Cantidad: ${quantity}`)
      } else {
        // Si ya existe, actualizar la cantidad
        cart.products[productIndex].quantity += quantity
        console.log(
          `Cantidad del producto ${productId} actualizada en el carrito ${cartId}. Nueva cantidad: ${cart.products[productIndex].quantity}`,
        )
      }

      // Guardar los cambios
      await cart.save()

      return true
    } catch (error) {
      console.error("Error al actualizar el carrito:", error.message)
      return false
    }
  }
}

const cartsManager = new CartsManager()
module.exports = cartsManager
