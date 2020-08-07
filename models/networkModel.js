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

var networkSchema = mongoose.Schema({
    name : String,
    phone: Number,
    adress : String,
    zipCode: Number,
    email: String,
    webSite: String,
    type: String,
    imageUrl: String,
    zoneAction: Buffer,
    products: [productShema]
   });

const networkModel = mongoose.model('networks', networkSchema);