const mongoose = require('mongoose');

var productSchema = mongoose.Schema({
    name: String,
    brand: String,
    type: String,
    network: String,
    refoundPrice: Number,
    impact: String,
    code: Number,
    imageUrl: String
});

var networkSchema = mongoose.Schema({
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
    products: [productSchema]
   });

const networkModel = mongoose.model('networks', networkSchema);