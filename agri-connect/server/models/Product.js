const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: Object,
    required: true,
  },
  category: {
    type: Object,
    required: true,
  },
  price: {
    type: Object,
    required: true
  },
  quantity: {
    type: Object,
    required: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  seller: {
    name: { type: Object, required: true },
    location: { type: Object, required: true },
    phone: { type: String, required: true },
    email: { type: String }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

module.exports = mongoose.model('Product', productSchema);
