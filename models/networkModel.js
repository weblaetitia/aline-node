const mongoose = require('mongoose');


var ProductSchema = mongoose.Schema({
    name: String,
    brand: String,
    type: String,
    refoundPrice: Number,
    barCode: String,
    imageUrl: String
});

var NetworkSchema = mongoose.Schema({

    firstName : String,
    lastName : String,
    businessName : String,
    phone: Number,
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
    products: [ProductSchema]
   });

const NetworkModel = mongoose.model('networks', NetworkSchema);

module.exports = NetworkModel