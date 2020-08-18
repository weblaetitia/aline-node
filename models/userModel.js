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

var FavSchema = mongoose.Schema({
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
    keywords: Array,
    products: [ProductSchema]
});

var UserSchema = mongoose.Schema({
    firstName : String,
    lastName : String,
    email: String,
    password: String,
    token: String,
    salt: String,
    favorites: [FavSchema]
   });

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel