const mongoose = require('mongoose');

var ProductSchema = mongoose.Schema({
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
    products: [ProductSchema]
   });

const PlaceModel = mongoose.model('places', PlaceSchema);

module.exports = PlaceModel