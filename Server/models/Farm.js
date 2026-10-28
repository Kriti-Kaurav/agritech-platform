const mongoose = require('mongoose');

const FarmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  area: Number,
  estDate: String,
  crop: String,
  farmerEmail: String
});

module.exports = mongoose.model('Farm', FarmSchema);