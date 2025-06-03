const fs = require("fs").promises; 
const path = require("path");

class CartsManager {
  constructor() {
    this.filePath = "";
    this.carts = [];
    this.nextId = 1;
  }

  async init() {
    try {
      this.filePath = path.join(__dirname, "..", "db", "carts.json");
      const data = await fs.readFile(this.filePath, "utf8");
      this.carts = JSON.parse(data);
      const lastCart = this.carts[this.carts.length - 1];
      this.nextId = lastCart ? lastCart.id + 1 : 1;
    } catch (error) {
      console.error("Error al leer el archivo de carts:", error.message);
      this.carts = [];
    }
  }

  async saveCarts() {
    try {
      const data = JSON.stringify(this.carts);
      await fs.writeFile(this.filePath, data, "utf8");
      console.log("Se actualizado la base de datos (carts.json )");
    } catch (e) {
      console.log("Error al guardar los carritos");
    }
  }

  getCarts() {
    return this.carts;
  }

  getCart(id) {
    const specificCart = this.carts.find((cart) => cart.id === id);
    return specificCart;
  }

  async addCart(products) {
    let newCart;
    if (products.length !== 0) {
      const id = this.nextId;
      this.nextId++;
      newCart = { id, products };
      this.carts.push(newCart);
      await this.saveCarts();
      console.log("Carrito Añadido");
    } else {
      console.log("Error");
    }
    return newCart;
  }

  async deleteCart(id) {
    let exito = 0;
    const cartIndex = this.carts.findIndex((cart) => cart.id == id);
    if (cartIndex !== -1) {
      this.carts.splice(cartIndex, 1);
      await this.saveCarts();
      exito = 1;
      console.log(`Carrito con ID ${id} eliminado.`);
    } else {
      console.log(`Error: Carrito con ID ${id} no encontrado`);
    }
    return exito;
  }

  async updateCart(id, productId, quantity) {
    if (typeof quantity !== 'number' || quantity <= 0) {
      console.error("Error en los parámetros: id, productId deben ser números, quantity debe ser un número positivo.");
      return false;
    }

    const cartIndex = this.carts.findIndex((cart) => cart.id === id);
    if (cartIndex === -1) {
      console.log(`Error: Carrito con ID ${id} no encontrado.`);
      return false; 
    }

    const cart = this.carts[cartIndex];productId
    const productIndex = cart.products.findIndex((item) => item.productId === productId);

    if (productIndex === -1) {
      cart.products.push({ productId: productId, quantity: quantity });
      console.log(`Producto ${productId} añadido al carrito ${id}. Cantidad: ${quantity}`);
    } else {
      cart.products[productIndex].quantity += quantity;
      console.log(`Cantidad del producto ${productId} actualizada en el carrito ${id}. Nueva cantidad: ${cart.products[productIndex].quantity}`);
    }

    await this.saveCarts();

    return true; 
  }
}

const cartsManager = new CartsManager();
module.exports = cartsManager;
