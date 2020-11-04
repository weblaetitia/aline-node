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

var PlaceSchema = mongoose.Schema({
    name : String,
    phone: String,
    adress : String,
    zipCode: String,
    city: String,
    latitude: Number,
    longitude: Number,
    webSite: String,
    type: String,
    network: String,
    services: String,
    google_place_id: String,
    placeImg: String,
    openingHours : Array,
    keywords : Array,
    products: [ProductSchema]
   });

const PlaceModel = mongoose.model('places', PlaceSchema);

module.exports = PlaceModel