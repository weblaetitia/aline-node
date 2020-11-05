const mongoose = require('mongoose');


var ProductSchema = mongoose.Schema({
    name: String,
    brand: String,
    type: String,
    refoundPrice: Number,
    barCode: String,
    imageUrl: String,
    keywords: Array
});

var NetworkSchema = mongoose.Schema({
    firstName : String,
    lastName : String,
    businessName : String,
    phone: String,
    adress : String,
    zipCode: Number,
    city : String,
    email: String,
    webSite: String,
    refoundType: String,
    imageUrl: String,
    zoneAction: Array,
    password: String,
    token: String,
    salt: String,
    keywords : Array,
    products: [ProductSchema]
   });

const NetworkModel = mongoose.model('networks', NetworkSchema);

module.exports = NetworkModel