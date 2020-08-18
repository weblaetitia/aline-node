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
    zipCode: Number,
    city: String,
    latitude: Number,
    longitude: Number,
    webSite: String,
    type: String,
    imageUrl: String,
    description: String,
    network: String,
    services: String,
    google_place_id: String,
    placeImg: String,
    openingHours : String,
    products: [ProductSchema]
   });

const PlaceModel = mongoose.model('places', PlaceSchema);

module.exports = PlaceModel