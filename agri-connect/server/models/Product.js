const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Grains', 'Vegetables', 'Seeds', 'Fertilizers', 'Pesticides', 'Equipment']
  },
  price: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  seller: {
    name: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
