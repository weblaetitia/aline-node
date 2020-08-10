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

    products: [ProductSchema]
   });

const NetworkModel = mongoose.model('networks', NetworkSchema);

module.exports = NetworkModel