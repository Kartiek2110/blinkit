const express = require('express');
const router = express.Router();
const { Product, validateProduct } = require("../Models/product");
const upload = require("../Config/muter_config");
const { Category, validateCategory } = require('../Models/category');
const {validateAdmin, userIsLoggendIn} = require('../middlewares/admin');
const { Cart, validateCart } = require('../Models/cart');

// GET all products
router.get("/",userIsLoggendIn, async function (req, res) {
  let somethingInCart = false
    
    const resultArray = await Product.aggregate([
        {
            $group: {
                _id: "$category", // Group by the category field
                products: { $push: "$$ROOT" }, // Push the product details to the array
            }
        },
        {
            $project: {
                category: "$_id", // Project the category as a field
                products: { $slice: ["$products", 10] } // Limit the products to the first 10
            }
        },

    ]);
   let cart = await Cart.findOne({ user: req.session.passport.user})
    if(cart && cart.products.length > 0) somethingInCart = true
   let rnProducts = await Product.aggregate([
        {$sample: { size:3}}
    ])
    const resultObject = resultArray.reduce((acc, item) => {
        acc[item.category] = item.products
        return acc
    }, {})
    res.render("index", {products:resultObject, rnProducts, somethingInCart, cartCount: cart.products.length});  // Pass products to the view
  
  
});

// DELETE product (GET or POST request)
router.post("/delete/:id", validateAdmin, async function (req, res) {
  try {
    if (req.user.admin) {
      await Product.findOneAndDelete({ _id: req.params.id || req.body.product_id });
      return res.redirect("/admin/products");
    } 
    return res.status(403).send("You are not allowed to delete");  // Use return to prevent further execution
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// CREATE product
router.post("/", upload.single("image"), async function (req, res) {
  try {
    if (!req.file) return res.status(400).send("Image is required");

    let { name, price, category, stock, description } = req.body;

    let { error } = validateProduct({ name, price, category, description, stock, image: req.file.buffer });
    if (error) return res.status(400).send(error.message);

    // Check if the category exists
    let isCategory = await Category.findOne({ name: category });
    if (!isCategory) {
      await Category.create({ name: category });
    }

    // Create new product
    await Product.create({
      name,
      price,
      category,
      image: req.file.buffer,
      description,
      stock,
    });

    return res.redirect("/admin/products");  // Send success response
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
