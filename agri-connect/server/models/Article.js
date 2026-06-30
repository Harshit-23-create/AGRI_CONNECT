const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Soil Management', 'Pest & Disease Control', 'Water Management', 'Modern Farming', 'Climate-Smart Farming']
  },
  readTime: {
    type: String,
    default: '5 min read'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Article', articleSchema);
