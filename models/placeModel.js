const mongoose = require('mongoose');

var ProductShema = mongoose.Schema({
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
    phone: String,
    adress : String,
    zipCode: Number,
    city: String,
    latitude: Number,
    longitude: Number,
    webSite: String,
    type: String,
    imageUrl: String,
    description: String,
    network: String,
    services: Array,
    google_place_id: String,
    products: [ProductShema]
   });

const PlaceModel = mongoose.model('places', PlaceSchema);

module.exports = PlaceModel