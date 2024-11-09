const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
    res.render("admin_dashboard")
})
router.get('/map/:orderid', function (req, res) {
    res.render("map", { orderid: req.params.orderid })
})

module.exports = router