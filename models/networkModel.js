const mongoose = require('mongoose');

<<<<<<< HEAD
var ProductShema = mongoose.Schema({
=======
var productSchema = mongoose.Schema({
>>>>>>> 7434a5e7b8b2cdfef53fba44d9a3d37403ef0280
    name: String,
    brand: String,
    type: String,
    network: String,
    refoundPrice: Number,
    impact: String,
    code: Number,
    imageUrl: String
});

<<<<<<< HEAD
var NetworkSchema = mongoose.Schema({
    name : String,
    phone: Number,
    adress : String,
    zipCode: Number,
    city: String,
=======
var networkSchema = mongoose.Schema({
    firstName : String,
    lastName : String,
    businessName : String,
    phone: Number,
    adress : String,
    zipCode: Number,
    city : String,
>>>>>>> 7434a5e7b8b2cdfef53fba44d9a3d37403ef0280
    email: String,
    webSite: String,
    refoundType: String,
    imageUrl: String,
    zoneAction: Array,
<<<<<<< HEAD
    products: [ProductShema]
=======
    products: [productSchema]
>>>>>>> 7434a5e7b8b2cdfef53fba44d9a3d37403ef0280
   });

const NetworkModel = mongoose.model('networks', NetworkSchema);

module.exports = NetworkModel