const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'Vegetable' },
  price: { type: Number, required: true },
  description: String,
  imgUrl: String,
  stock: { type: Number, default: 50 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);