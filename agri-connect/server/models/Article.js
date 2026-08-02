const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: Object,
    required: true,
  },
  content: {
    type: Object,
    required: true
  },
  category: {
    type: Object,
    required: true,
  },
  readTime: {
    type: Object,
    default: { en: '5 min read' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

module.exports = mongoose.model('Article', articleSchema);
