const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let query = {};
    
    if (category && category !== 'All') {
      query['category.en'] = category;
    }
    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { 'title.en': searchRegex },
        { 'title.hi': searchRegex },
        { 'title.pa': searchRegex },
        { 'title.mr': searchRegex },
        { 'title.gu': searchRegex },
        { 'title.bn': searchRegex },
        { 'title.ta': searchRegex },
        { 'title.te': searchRegex },
        { 'title.kn': searchRegex },
        { 'title.ml': searchRegex },
        { 'title.or': searchRegex }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching products' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getProducts,
  getProductById
};
