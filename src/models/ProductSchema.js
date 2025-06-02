const mongoose = require("mongoose");

const productScheme = new mongoose.Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  price: { type: Number, require: true },
  category:{ type: String, require: true },
  code: { type: Number, require: true },
  stock: { type: Number, require: true },
});


const products = mongoose.model("Items",productScheme);
module.exports = products;