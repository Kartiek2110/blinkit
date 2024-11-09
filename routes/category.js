const express = require('express');
const router = express.Router();
const { Category, validateCategory } = require('../Models/category');
const {validateAdmin} = require('../middlewares/admin');

router.post("/create", validateAdmin,async function(req, res){
   let category = await Category.create({
        name: req.body.name
    })
    res.redirect("back")
})

 

module.exports = router