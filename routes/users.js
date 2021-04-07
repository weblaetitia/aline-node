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


/* GET token */
router.get('/mobile/check-token', async function(req, res, next) {
  var myrequest = await UserModel.findOne({
    token: req.query.token
    }) 
  if (myrequest) {
    res.json({
      succes: true, 
      firstName: myrequest.firstName,
      lastName: myrequest.lastName,
      email: myrequest.email,
      token: myrequest.token,
    })
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
    if (myrequest.length != 0) {
      var hash = SHA256(req.body.password + myrequest[0].salt).toString(encBase64)
      if (hash == myrequest[0].password) {
        res.json({
          succes: true,
          alert: 'all good', 
          token: myrequest[0].token,
          firstName: myrequest[0].firstName,
          lastName: myrequest[0].lastName, 
          email: myrequest[0].email, 
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
    // send a succes and token
    res.json({
      succes: true,
      alert: 'New user saved',
      token: userSaved.token, 
      firstName: userSaved.firstName,
      lastName: userSaved.lastName,
      email: userSaved.email,
    })
  }
})

/* GET user's fav */
router.get('/mobile/get-user-fav/', async function (req, res, next) {
  user = await UserModel.findOne({
    token: req.query.token
  })
  userFavs = user.favorites
  
  if (userFavs.length >0) {
    res.json(userFavs)
  } else {
    res.json(false)
  }
})

/* CHECK user's fav */
router.get('/mobile/check-fav/', async function (req, res, next) {
  var user = await UserModel.findOne({
    token: req.query.token
  })

  user.favorites.forEach(fav => {
    if(fav._id == req.query.placeid) {
      res.json(true)
    } 
  })
})

/* GET add favorite */
router.get('/mobile/add-fav', async function (req, res, next) {
  place = await PlaceModel.findOne({
    _id: req.query.placeid
  })
  
  user = await UserModel.findOne({
    token: req.query.token
  })
  user.favorites.push(place)
  var userSaved = await user.save()
  if (userSaved) {
    res.json(user.favorites)
  } else {
    res.json(false)
  }
})


/* GET delet favorite */
router.get('/mobile/delete-fav', async function (req, res, next) {
  user = await UserModel.findOne({
    token: req.query.token
  })
  var newFavs = user.favorites.filter(fav => (fav._id != req.query.placeid))
  user.favorites = newFavs
  var userSaved = await user.save()
  if (userSaved) {
    res.json(user.favorites)
  } else {
    res.json(false)
  }

})


module.exports = router;
