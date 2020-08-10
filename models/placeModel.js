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

var PlaceSchema = mongoose.Schema({
    name : String,
    phone: Number,
    adress : String,
    zipCode: Number,
    city: String,
    email: String,
    webSite: String,
    type: String,
    imageUrl: String,
    description: String,
    network: String,
    services: Array,
<<<<<<< HEAD
    products: [ProductShema]
=======
    products: [productSchema]
>>>>>>> 7434a5e7b8b2cdfef53fba44d9a3d37403ef0280
   });

const PlaceModel = mongoose.model('places', PlaceSchema);

module.exports = PlaceModel