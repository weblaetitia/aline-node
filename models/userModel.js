const mongoose = require('mongoose');

var favSchema = mongoose.Schema({
    name: String,
    adress: String,
    zipCode: Number,
    description: String,
    type: String,
});

var userSchema = mongoose.Schema({
    firstName : String,
    lastName : String,
    email: String,
    password: String,
    favorites: [favSchema]
   });

const userModel = mongoose.model('users', userSchema);