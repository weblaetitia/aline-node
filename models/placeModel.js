const mongoose = require('mongoose');

var productShema = mongoose.Schema({
    name: String,
    brand: String,
    type: String,
    network: String,
    refoundPrice: Number,
    impact: String,
    code: Number,
    imageUrl: String
});

var placeSchema = mongoose.Schema({
    name : String,
    phone: Number,
    adress : String,
    zipCode: Number,
    email: String,
    webSite: String,
    type: String,
    imageUrl: String,
    description: String,
    network: String,
    services: Array,
    products: [productShema]
   });

const placeModel = mongoose.model('places', placeSchema);