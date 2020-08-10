var express = require('express');
var router = express.Router();
var SHA256 = require('crypto-js/sha256')
var encBase64 = require('crypto-js/enc-base64')
var uid2 = require('uid2')

var UserModel = require('../models/userModel');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST user */
/*$$$$$$$$$$$ route de test à supprimer en prod $$$$$$$$$$*/
/* a utiliser avec postman pour ajouter des utilisateurs */

router.post('/mobile/adduser', async function(req, res, next) {
  
  // chek if user alredy exist
  var userExist = await UserModel.findOne({
    email: req.body.email
  })
  if (userExist != null) {
    res.json({
      succes: false,
      alert: 'User with this email already exists'
    })
  } else {
    console.log('dans la route')
    // encrypt password
    var userSalt = uid2(32)
    // connexion à la db
    var newUser = await new UserModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: SHA256(req.body.password + userSalt).toString(encBase64),
      token: uid2(32),
      salt: userSalt,
    })
    var userSaved = await newUser.save()
    console.log(userSaved)
    res.json({
      succes: true,
      alert: 'New user saved'
    })
  }
})



router.post('/sign-up', async function(req,res,next){

  var searchUser = await userModel.findOne({
    email: req.body.emailFromFront
  })
  
  if(!searchUser){
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: req.body.passwordFromFront,
    })
  
    var newUserSave = await newUser.save();
  
    req.session.user = {
      name: newUserSave.username,
      id: newUserSave._id,
    }
  
    console.log(req.session.user)
  
    res.redirect('/form')
  } else {
    res.redirect('/login')
  }
  
})

router.post('/sign-in', async function(req,res,next){

  var searchUser = await userModel.findOne({
    email: req.body.emailFromFront,
    password: req.body.passwordFromFront
  })

  if(searchUser!= null){
    req.session.user = {
      name: searchUser.username,
      id: searchUser._id
    }
    res.redirect('/form')
  } else {
    res.render('login')
  }

  
})

router.get('/logout', function(req,res,next){

  req.session.user = null;

  res.redirect('/login')
})


module.exports = router;
