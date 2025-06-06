const mongoose = require("mongoose");
const ProductsScheme = require("../models/ProductSchema");

const socketService = require("../services/socket.service");

class ProductsManager {
  constructor() {}

  async init() {
    try {
      console.log("ProductsManager inicializado para MongoDB");
    } catch (error) {
      console.error("Error al leer el archivo de productos:", error.message);
      //this.products = [] // fallback por si el archivo está vacío o no existe
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
      const existingProduct = await ProductsScheme.findOne({ code: code });

      if (!existingProduct) {
        const id = this.nextId;
        this.nextId++;
        const productData = {
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

        // Verificar que el codigo no exista ya en la base de datos
        const existingProduct = await ProductsScheme.findOne({ code: code });
        if (existingProduct) {
          throw new Error(`Ya existe un producto con el código: ${code}`);
        }

        const newProduct = new ProductsScheme(productData);
        const saveProducts = await newProduct.save();

        console.log("Producto añadido:", newProduct);

        // Usar el servicio de socket para emitir la actualización
        const allProducts = await this.getProducts();
        socketService.emitProductUpdate(allProducts);

        return saveProducts;
      } else {
        throw new Error("Error: Todos los campos son requeridos");
      }
    } else {
      console.log("Error: Algun campo no fue dado correctamente");
    }
    return newProduct;
  }
  
  async getProducts(limit, page, sort, query) {
    try {
      let skip = page && limit ? (page - 1) * limit : 0;
      let dbQuery = {};
      let sortOptions = {};
      console.log(query);
      // Construimos dbQuery con campos específicos
      if (query) {
        const allowedFields = [
          "category",
          "code",
          "stock",
          "status",
          "price",
          "title",
          "description",
        ];
        for (const field of allowedFields) {
          if (query[field] !== undefined) {
            // Buscar parcial si es string
            if (typeof query[field] === "string") {
              dbQuery[field] = { $regex: query[field], $options: "i" };
            } else {
              dbQuery[field] = query[field];
            }
          }
        }
      }

      // Procesamiento de ordenamiento
      if (sort) {
        const [field, order] = sort.split(":");
        if (field) {
          sortOptions[field] = order === "desc" ? -1 : 1;
        }
      }

      // Construcción de la consulta
      let productsQuery = ProductsScheme.find(dbQuery);

      if (Object.keys(sortOptions).length > 0) {
        productsQuery = productsQuery.sort(sortOptions);
      }

      if (limit) productsQuery = productsQuery.limit(limit);
      if (skip) productsQuery = productsQuery.skip(skip);

      const products = await productsQuery.exec();
      return products;
    } catch (error) {
      console.error("Error al obtener productos:", error.message);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      // Verificar si el ID es un ObjectId válido de MongoDB
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("Error: ID de producto inválido");
        return null;
      }

      const specificProduct = await ProductsScheme.findById(id);

      if (specificProduct) {
        console.log("Éxito: Producto encontrado");
      } else {
        console.log("Error: Producto no encontrado");
      }

      return specificProduct;
    } catch (error) {
      console.error("Error al buscar producto por ID:", error.message);
      return null;
    }
  }

  async updateProduct(id, campo, valor) {
    try {
      // Verificar si el ID es válido
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("Error: ID de producto inválido");
        return 0;
      }

      // Campos permitidos para actualizar
      const camposPermitidos = [
        "title",
        "description",
        "price",
        "category",
        "code",
        "stock",
        "status",
        "thumbnails",
      ];

      if (!camposPermitidos.includes(campo)) {
        console.log("Error: Campo no válido para actualización");
        return 0;
      }

      const updateData = {};
      updateData[campo] = valor;

      const updatedProduct = await ProductsScheme.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (updatedProduct) {
        console.log("Producto actualizado:", updatedProduct);
        // Emitir actualización por WebSocket
        const allProducts = await this.getProducts();
        socketService.emitProductUpdate(allProducts);
        return 1;
      } else {
        console.log("Error: Producto no encontrado");
        return 0;
      }
    } catch (e) {
      console.log("Error: Producto no encontrado");
      return 0;
    }
  }

  async deleteProduct(id) {
    try {
      // Verificar si el ID es válido
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("Error: ID de producto inválido");
        return 0;
      }

      const deletedProduct = await ProductsScheme.findByIdAndDelete(id);
      // Verificamos si se elimino o no
      if (deletedProduct) {
        console.log(`Producto con ID ${id} eliminado.`);

        // Emitir actualización por WebSocket
        const allProducts = await this.getProducts();
        socketService.emitProductUpdate(allProducts);

        return 1;
      } else {
        console.log(`Error: Producto con ID ${id} no encontrado`);
        return 0;
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error.message);
    }
  }
}

const productsManager = new ProductsManager();
module.exports = productsManager;
