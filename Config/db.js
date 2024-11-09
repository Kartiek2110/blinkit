const mongoose = require('mongoose')
mongoose.connect(process.env.MONGOURL).then(function(){
    console.log("Connected to Mongodb")
})

module.exports = mongoose.connection