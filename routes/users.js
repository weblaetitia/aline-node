var express = require('express');
var router = express.Router();
var SHA256 = require('crypto-js/sha256')
var encBase64 = require('crypto-js/enc-base64')
var uid2 = require('uid2')

var UserModel = require('../models/userModel');
var PlaceModel = require('../models/placeModel');


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
/*^^^^^^^^^^^^ route de test à supprimer en prod ^^^^^^^^^^^^*/


/* GET token */
router.get('/mobile/check-token', async function(req, res, next) {
  console.log(req.query.token)
  var myrequest = await UserModel.findOne({
    token: req.query.token
    }) 
  console.log(myrequest)
  if (myrequest) {
    res.json({succes: true})
  } else {
    res.json({succes: false})
  }
})


/* POST sign-in */
router.post('/mobile/sign-in/', async function(req, res, next) {
  // Check if all inputs are field
  if ((req.body.email == 'undefined') || (req.body.password == 'undefined')) {
    res.json({
      succes: false,
      alert: 'All fields must be provided'
    })
  } else {
    // all fields are provided now check if user exist
    var myrequest = await UserModel.find({
      email: req.body.email
      })    
    console.log(myrequest)  
    if (myrequest.length != 0) {
      var hash = SHA256(req.body.password + myrequest[0].salt).toString(encBase64)
      if (hash == myrequest[0].password) {
        res.json({
          succes: true,
          alert: 'all good', 
          token: myrequest[0].token
        })
      } else {
        res.json({
          succes: false,
          alert: 'wrong password'
        })
      }
      
    } else {
      res.json({
        succes: false,
        alert: 'User not exists'
      })
    }
  }
})



/* POST sign-up */
router.post('/mobile/sign-up', async function(req, res, next) {
  
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
    // encrypt password
    var userSalt = uid2(32)
    // add user
    var newUser = await new UserModel({
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      email: req.body.email,
      password: SHA256(req.body.password + userSalt).toString(encBase64),
      token: uid2(32),
      salt: userSalt,
    })
    var userSaved = await newUser.save()
    console.log(userSaved)
    // send a succes and token
    res.json({
      succes: true,
      alert: 'New user saved',
      token: userSaved.token 
    })
  }
})


/* GET add favorite */
router.get('/mobile/add-fav', async function (req, res, next) {
  // console.log(req.query.token) // ok
  // console.log(req.query.placeid) // ok
  place = await PlaceModel.findOne({
    _id: req.query.placeid
  })

  
  user = await UserModel.findOne({
    token: req.query.token
  })
  user.favorites.push(place)
  var userSaved = user.save()
  if (userSaved) {
    res.json({succes: true})
  } else {
    res.json({succes: false})
  }
})


module.exports = router;
