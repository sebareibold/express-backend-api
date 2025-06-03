const mongoose = require("mongoose");

const productScheme = new mongoose.Schema(
  {
    title: { type: String, require: true, trim: true },
    description: { type: String, require: true, trim: true },
    price: { type: Number, require: true, min: 0 },
    category: { type: String, require: true, trim: true },
    code: { type: Number, require: true, unique: true, trim: true },
    stock: { type: Number, require: true, min: 0 },
    status: { type: Boolean, require: false, default: true },
    thumbnails: {
      type: [String], // Array de strings para las URLs de imagenes
      required: true,
      validate: {
        validator: (v) => v && v.length > 0,
        message: "Debe tener al menos una imagen",
      },
    },
  },
  {
    collection: "products", // Nombre explicito de la colección
  }
);

const Products = mongoose.model("Products", productScheme);
module.exports = Products;
