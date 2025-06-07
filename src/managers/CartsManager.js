const mongoose = require("mongoose");
const CartSchema = require("../models/CartSchema");
const socketService = require("../services/socket.service");

class CartsManager {
  constructor() {}

  async init() {
    try {
      console.log("ProductsManager inicializado para MongoDB");
    } catch (error) {
      console.error("Error al leer el archivo de carts:", error.message);
      //this.carts = [];
    }
  }

  async getCarts() {
    try {
      const carts = await CartSchema.find();
      return carts;
    } catch (error) {
      console.error("Error al obtener cart:", error.message);
      return [];
    }
  }

  async getCart(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("Error: ID de cart inválido");
        return null;
      }
      const cart = await CartSchema.findById(id); // Cambiar find por findById

      if (cart) {
        console.log("Éxito: Cart encontrado");
      } else {
        console.log("Error: Cart no encontrado");
      }
      return cart;
    } catch (error) {
      console.error("Error al buscar Cart por ID:", error.message);
      return null;
    }
  }

  async addCart(products) {
    try {
      // Verificamos q no este vacio
      if (!products || products.length == 0) {
        throw new Error(`Carrito Vacio`);
      }
      //Creamos el esquema con los datos, y lo guardamos en la col.
      const newCart = new CartSchema({ products: products }); // Pasar como objeto con propiedad products
      const saveCart = await newCart.save();

      console.log("Cart añadido:", newCart);

      return saveCart;
    } catch (error) {
      console.error("Error", error.message);
      throw error; // Re-lanzar el error para que sea manejado por la ruta
    }
  }

  async deleteCart(id) {
    try {
      // Verificar si el ID es válido
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("Error: ID de Cart inválido");
        return 0;
      }
      const deleteCart = await CartSchema.findByIdAndDelete(id);
      if (deleteCart) {
        console.log(`Cart con ID ${id} eliminado.`);
      } else {
        console.log(`ERROR: Cart con ID ${id} NO eliminado.`);
      }
    } catch (error) {
      console.error("Error al eliminar cart:", error.message);
    }
  }

  async updateCart(cartId, productId, quantity) {
    try {
      // Validaciones
      if (
        !mongoose.Types.ObjectId.isValid(cartId) ||
        !mongoose.Types.ObjectId.isValid(productId)
      ) {
        console.error("Error: IDs inválidos.");
        return false;
      }

      if (typeof quantity !== "number" || quantity <= 0) {
        console.error("Error: La cantidad debe ser un número positivo.");
        return false;
      }

      // Buscar el carrito por ID
      const cart = await CartSchema.findById(cartId);
      if (!cart) {
        console.log(`Error: Carrito con ID ${cartId} no encontrado.`);
        return false;
      }

      // Buscar si el producto ya existe en el carrito
      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex === -1) {
        // Si no existe, agregarlo
        cart.products.push({ productId, quantity });
        console.log(
          `Producto ${productId} añadido al carrito ${cartId}. Cantidad: ${quantity}`
        );
      } else {
        // Si ya existe, actualizar la cantidad
        cart.products[productIndex].quantity += quantity;
        console.log(
          `Cantidad del producto ${productId} actualizada en el carrito ${cartId}. Nueva cantidad: ${cart.products[productIndex].quantity}`
        );
      }

      // Guardar los cambios
      await cart.save();

      return true;
    } catch (error) {
      console.error("Error al actualizar el carrito:", error.message);
      return false;
    }
  }

  // Metodo para eliminar un producto específico del carrito
  async removeProductFromCart(cartId, productId) {
    try {
      // Buscar el carrito por ID
      const cart = await CartSchema.findById(cartId);
      if (!cart) {
        console.log(`Error: Carrito con ID ${cartId} no encontrado.`);
        return null;
      }

      // Filtrar el producto a eliminar
      const initialLength = cart.products.length;
      cart.products = cart.products.filter(
        (item) => item.productId.toString() !== productId
      );

      // Verificar si se eliminó algún producto
      if (cart.products.length === initialLength) {
        console.log(
          `Producto ${productId} no encontrado en el carrito ${cartId}.`
        );
        return cart; // Devolver el carrito sin cambios
      }

      // Guardar los cambios
      const updatedCart = await cart.save();
      console.log(`Producto ${productId} eliminado del carrito ${cartId}.`);

      return updatedCart;
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error.message);
      return null;
    }
  }

  // Metodo para reemplazar todos los productos del carrito
  async updateCartWithNewProductList(cartId, newProducts) {
    try {
      
      // Validar estructura de cada producto
      for (const product of newProducts) {
        if (
          !product.productId ||
          !mongoose.Types.ObjectId.isValid(product.productId)
        ) {
          console.error("Error: Cada producto debe tener un productId válido.");
          return null;
        }
        if (
          !product.quantity ||
          typeof product.quantity !== "number" ||
          product.quantity <= 0
        ) {
          console.error("Error: Cada producto debe tener una cantidad válida.");
          return null;
        }
      }

      // Buscar el carrito por ID
      const cart = await CartSchema.findById(cartId);
      if (!cart) {
        console.log(`Error: Carrito con ID ${cartId} no encontrado.`);
        return null;
      }

      // Reemplazar todos los productos
      cart.products = newProducts;

      // Guardar los cambios
      const updatedCart = await cart.save();
      console.log(
        `Carrito ${cartId} actualizado con nueva lista de productos.`
      );

      return updatedCart;
    } catch (error) {
      console.error(
        "Error al actualizar carrito con nueva lista:",
        error.message
      );
      return null;
    }
  }

  // Metodo para actualizar la cantidad de un producto específico
  async updateCartMoreQuantifyOfProduct(cartId, productId, newQuantity) {
    try {
      
      if (typeof newQuantity !== "number" || newQuantity <= 0) {
        console.error("Error: La cantidad debe ser un número positivo.");
        return null;
      }

      // Buscar el carrito por ID
      const cart = await CartSchema.findById(cartId);
      if (!cart) {
        console.log(`Error: Carrito con ID ${cartId} no encontrado.`);
        return null;
      }

      // Buscar el producto en el carrito
      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex === -1) {
        console.log(
          `Producto ${productId} no encontrado en el carrito ${cartId}.`
        );
        return null;
      }

      // Actualizar la cantidad (reemplazar, no sumar)
      cart.products[productIndex].quantity = newQuantity;
      console.log(
        `Cantidad del producto ${productId} actualizada a ${newQuantity} en el carrito ${cartId}.`
      );

      // Guardar los cambios
      const updatedCart = await cart.save();

      return updatedCart;
    } catch (error) {
      console.error(
        "Error al actualizar cantidad del producto:",
        error.message
      );
      return null;
    }
  }

  // Metodo para vaciar todos los productos del carrito (mantener el carrito)
  async emptyCart(cartId) {
    try {
      // Validaciones
      if (!mongoose.Types.ObjectId.isValid(cartId)) {
        console.error("Error: ID de carrito inválido.");
        return null;
      }

      // Buscar el carrito por ID
      const cart = await CartSchema.findById(cartId);
      if (!cart) {
        console.log(`Error: Carrito con ID ${cartId} no encontrado.`);
        return null;
      }

      // Vaciar el array de productos
      cart.products = [];

      // Guardar los cambios
      const updatedCart = await cart.save();
      console.log(`Carrito ${cartId} vaciado exitosamente.`);

      return updatedCart;
    } catch (error) {
      console.error("Error al vaciar carrito:", error.message);
      return null;
    }
  }
}

const cartsManager = new CartsManager();
module.exports = cartsManager;
