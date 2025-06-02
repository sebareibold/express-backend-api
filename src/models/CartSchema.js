const mongoose = require("mongoose");

const  cartScheme = new mongoose.Schema({
  products: { type: Array, require: true },
});


const cart = mongoose.model("Carts",cartScheme);
module.exports = cart;