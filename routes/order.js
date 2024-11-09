const express = require('express');
const { Payment } = require('../Models/payment');
const { Order } = require('../Models/order');
const { Cart } = require('../Models/cart');
const router = express.Router();

router.get('/:userid/:orderid/:paymentid/:signature', async function (req, res) {
    let paymentDetails = await Payment.findOne({ orderId: req.params.orderid })

    if (!paymentDetails) return res.send("Payment Not Found");
    if (req.params.signature === paymentDetails.signature && req.params.paymentid === paymentDetails.paymentId) {
     let cart =   await Cart.findOne({ user: req.params.userid })

       await Order.create({
            orderId: req.params.orderid,
            user: req.params.userid,
            products: cart.products,
            totalPrice:cart.totalPrice,
            status: "processing",
            payment: paymentDetails._id,
            
        })
        res.redirect(`/map/${req.params.orderid}`);
    } else {
        res.send("Payment Failed");
    }

});

router.get('/address/:orderid', async function (req, res) {
    let order = await Order.findOne({ orderId: req.params.orderid })
    if (!order) return res.send("Sorry , this order is not available")
    if (!req.body.address) return res.send("You must provide an address")
    order.address = req.params.address
    order.redirect("/")
});


module.exports = router