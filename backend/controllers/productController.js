import asyncHandler from "../middlewares/asyncHandler.js";
import Product from '../models/productModal.js';
import fs from 'fs';
import path from "path";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand, image } = req.fields;

    if (!name) throw new Error('Name is required');
    if (!brand) throw new Error('Brand is required');
    if (!description) throw new Error('Description is required');
    if (!price) throw new Error('Price is required');
    if (!category) throw new Error('Category is required');
    if (!quantity) throw new Error('Quantity is required');
    if (!image) throw new Error('Image is required');

    const product = new Product({ ...req.fields });
    await product.save();
    res.json(product);

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});



// UPDATE PRODUCT
const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      brand,
      countInStock,
      image,
    } = req.fields;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Delete old image if a new image is provided and it's different
    if (image && image !== product.image) {
      const oldImagePath = path.join(path.resolve(), product.image);
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("❌ Failed to delete old image:", err.message);
        } else {
          console.log("🧼 Old image deleted:", product.image);
        }
      });
    }

    // Update fields
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.quantity = quantity;
    product.brand = brand;
    product.countInStock = countInStock || product.countInStock;
    product.image = image || product.image;

    const updated = await product.save();
    res.json({ message: "Product updated", product: updated });

  } catch (error) {
    console.error(error);
    res.status(404).json({ error: error.message });
  }
});

// DELETE PRODUCT
const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.image) {
      const imagePath = path.join(path.resolve(), product.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('❌ Failed to delete image file:', err.message);
        } else {
          console.log('🧼 Image deleted:', product.image);
        }
      });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// FETCH PRODUCTS (with search + limit)
const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// FETCH PRODUCT BY ID
const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});

// FETCH ALL PRODUCTS
const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('category')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});


// ADD PRODUCT REVIEW
const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// FETCH TOP PRODUCTS
const fetchTopProduct = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// FETCH NEW PRODUCTS
const fetchNewProduct = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// FETCH RANDOM PRODUCTS

export const fetchRandomProducts = async (req, res) => {
  try {
    const requestedCount = parseInt(req.query.count) || 1;
    const total = await Product.countDocuments();
    const count = Math.max(1, Math.min(requestedCount, total)); 
    const products = await Product.aggregate([{ $sample: { size: count } }]);

    res.json(products);
  } catch (error) {
    console.error('Error fetching random products:', error);
    res.status(500).json({ message: 'Failed to fetch random products' });
  }
};


export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  fetchTopProduct,
  addProductReview,
  fetchNewProduct,
  filterProducts,
- fetchRandomProducts,
};

