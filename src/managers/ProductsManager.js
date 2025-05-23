const fs = require("fs").promises; // Usamos promesas de fs para trabajar con async/await
const path = require("path");

class ProductsManager {
  constructor() {
    this.filePath = "";
    this.products = [];
    this.nextId = 0;
    this.io = null;
  }

  async init() {
    try {
      this.filePath = path.join(__dirname, "..", "db", "products.json");
      const data = await fs.readFile(this.filePath, "utf8");
      this.products = JSON.parse(data);
      const lastProd = this.products[this.products.length - 1];
      this.nextId = lastProd ? lastProd.id + 1 : 1;
    } catch (error) {
      console.error("Error al leer el archivo de productos:", error.message);
      this.products = []; // fallback por si el archivo está vacío o no existe
    }
  }

  setSocketManager(io) {
    this.io = io;
    console.log("ProductManager tiene acceso al socket Socket.io");
  }

  async saveProducts() {
    try {
      const data = JSON.stringify(this.products);
      await fs.writeFile(this.filePath, data, "utf8");
      console.log("Se actualizado la base de datos (products.json )");
    } catch {
      console.log("Error al guardar los productos");
    }
  }

  async addProduct(
    title,
    description,
    price,
    category,
    code,
    stock,
    status,
    thumbnails
  ) {
    let newProduct;
    if (
      !(
        !title ||
        !description ||
        price == null ||
        !category ||
        !code ||
        stock == null ||
        !thumbnails ||
        !status
      )
    ) {
      if (this.products.some((p) => p.code !== code)) {
        const id = this.nextId;
        this.nextId++;
        newProduct = {
          id,
          title,
          description,
          price,
          category,
          code,
          stock,
          status,
          thumbnails,
        };
        this.products.push(newProduct);
        await this.saveProducts();
        console.log("Producto añadido:", newProduct);

        //Implementacion de Websockets, emitimos cambios a los clientes que estan conectados en "/realTiemProducts"
        this.io?.emit("productListUpdate", this.products);
        console.log("Socket emitio un mensaje");
      }
    } else {
      console.log("Error: Algun campo no fue dado correctamente");
    }
    return newProduct;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const specificProduct = this.products.find((product) => product.id === id);
    specificProduct
      ? console.log("Exito: Producto encontrado")
      : console.log("Error: Producto no encontrado");

    return specificProduct;
  }

  async updateProduct(id, campo, valor) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    let exito;
    if (productIndex !== -1) {
      
      this.products[productIndex][campo] = valor;
      await this.saveProducts();

      //Implementacion de Websockets, emitimos cambios a los clientes que estan conectados en "/realTiemProducts"
      this.io?.emit("productListUpdate", this.products);
      console.log("Socket emitio un mensaje");

      exito = 1;
    } else {
      console.log("Error: Producto no encontrado");
      exito = 0;
    }
    return exito;
  }

  async deleteProduct(id) {
    const IndexProduct = this.products.findIndex(
      (product) => product.id === id
    );
    let exito;
    if (IndexProduct !== -1) {
      this.products.splice(IndexProduct, 1);
      await this.saveProducts();
      console.log(`Producto con ID ${id} eliminado.`);

      //Implementacion de Websockets, emitimos cambios a los clientes que estan conectados en "/realTiemProducts"
      this.io?.emit("productListUpdate", this.products);
      console.log("Socket emitio un mensaje");

      exito = 1;
    } else {
      console.log(`Error: Producto con ID ${id} no encontrado`);
      exito = 0;
    }
    return exito;
  }
}

const productsManager = new ProductsManager();
module.exports = productsManager;

/*
    Conceptos Nuevos
    * Funciones de arreglos:
      - splice:
      - find:
      - findeIndex:
      - push
    * Funcion de File System(fs):
      - readFile
      - writeFile
    * Funciones de Conversion:
      - stringify: pasa de objeto a .json
      - JSON.parse(data): pasa de .json a objeto
*/
