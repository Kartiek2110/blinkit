const express = require('express')
const router = express.Router()
const { Admin } = require("../Models/admin")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {validateAdmin} = require('../middlewares/admin')
const { Product } = require('../Models/product')
const { Category } = require('../Models/category')

require("dotenv").config()

if (typeof process.env.NODE_ENV !== undefined && process.env.NODE_ENV === "DEVELOPMENT") {
    router.get('/create', async function (req, res) {
        try {
            let salt = await bcrypt.genSalt(10)
            let hash = await bcrypt.hash("admin", salt)
            let user = new Admin({
                name: "Kartik",
                email: "test@gmail.com",
                password: hash,
                role: "admin",
            })
            await user.save()
            let token = jwt.sign({ email: "test@gmail.com", admin: true }, process.env.JWT_KEY)
            res.cookie("token", token)
            res.send("Admin is successfully created")
        } catch (err) {
            res.send(err.message)
        }
    })
}

router.get("/login", function (req, res) {
    res.render("admin_login")
})
router.post("/login", async function (req, res) {
    let { email, password } = req.body
    let admin = await Admin.findOne({ email })
    if (!admin) return res.semd("This admin is not available")

    let valid = await bcrypt.compare(password, admin.password)
    if (valid) {
        let token = jwt.sign({ email: "test@gmail.com", admin: true }, process.env.JWT_KEY)
        res.cookie("token", token)
        res.redirect("/admin/dashboard")
    }
})
router.get("/dashboard", validateAdmin, async function (req, res) {
    let prodcount = await Product.countDocuments()
    let categcount = await Category.countDocuments()


    res.render("admin_dashboard", { prodcount, categcount })
})
router.get("/products", validateAdmin, async function (req, res) {

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
    const resultObject = resultArray.reduce((acc, item) => {
        acc[item.category] = item.products
        return acc
    }, {})



    res.render("admin_products", { products: resultObject })
})
router.get("/logout", validateAdmin, function (req, res) {
    res.cookie("token", "")
    res.redirect("/admin/login")
})

module.exports = router