const mongoose = require('mongoose');

var FavSchema = mongoose.Schema({
    name: String,
    adress: String,
    zipCode: Number,
    description: String,
    type: String,
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