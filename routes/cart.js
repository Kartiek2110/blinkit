const express = require('express');
const router = express.Router();
const { Cart, validateCart } = require('../Models/cart');
const { validateAdmin, userIsLoggendIn } = require('../middlewares/admin');
const { Product } = require('../Models/product');

router.get("/", userIsLoggendIn, async function (req, res) {
    try {
        let cart = await Cart.findOne({ user: req.session.passport.user })
        let cartDataStructure = {}
        cart.products.forEach(product =>{
            let key = product._id.toString()
            if(cartDataStructure[key]){
                cartDataStructure[key].quantity += 1
            }else {
                cartDataStructure[key] = {
                    ...product._doc,
                    quantity:1
                }
            }
        })
        let finalarray =  Object.values(cartDataStructure)
       
        res.render("cart", {cart: finalarray, finalprice: cart.totalPrice, userid: req.session.passport.user})

    }
    catch (err) {
        res.send(err.message)
    }
})
router.get("/add/:id", userIsLoggendIn, async function (req, res) {
    try {
        let cart = await Cart.findOne({ user: req.session.passport.user })
        let product = await Product.findOne({ _id: req.params.id })
        if (!cart) {
            cart = await Cart.create({
                user: req.session.passport.user,
                products: [req.params.id],
                totalPrice: Number(product.price)
            })

        }
        else {
            cart.products.push(req.params.id)
            cart.totalPrice = Number(cart.totalPrice) + Number(product.price)

            await cart.save()
        }
        res.redirect("back")
    }
    catch (err) {
        res.send(err.message)
    }
})
router.get("/remove/:id", userIsLoggendIn, async function (req, res) {
    try {
        let cart = await Cart.findOne({ user: req.session.passport.user })
        let product = await Product.findOne({ _id: req.params.id })
        if (!cart) {
            return res.send("there is noting in the cart")

        }
        else {
           let prodid =  cart.products.indexOf(req.params.id)
            cart.products.splice(prodid, 1)
            cart.totalPrice = Number(cart.totalPrice) - Number(product.price)

            await cart.save()
        }
        res.redirect("back")
    }
    catch (err) {
        res.send(err.message)
    }
})

router.get("/remove/:id", userIsLoggendIn, async function (req, res) {
    try {
        let cart = await Cart.findOne({ user: req.params.session.passport.user })
        if (!cart) return res.send("something went wrong while removing item")
        let index = cart.products.indexOf(req.params.id)
        if (index !== -1) cart.products.splice(index, 1)
        else return res.send("item is not in the cart")
        await cart.save()
        res.redirect("back")

    } catch (err) {
        res.send(err.message)
    }
})


module.exports = router