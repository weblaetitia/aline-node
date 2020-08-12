var express = require('express');
var router = express.Router();
var SHA256 = require('crypto-js/sha256')
var encBase64 = require('crypto-js/enc-base64')
var uid2 = require('uid2')

var NetworkModel = require('../models/networkModel')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/* GET token */
router.get('/check-token', async function(req, res, next) {
  console.log(req.query.token)
  var myrequest = await networkModel.findOne({
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
router.post('/sign-in', async function(req,res,next){

// Check if all inputs are field
if ((req.body.emailFromFront == 'undefined') || (req.body.passwordFromFront == 'undefined')) {
  res.json({
    succes: false,
    alert: 'All fields must be provided'
  })
} else {
  // all fields are provided now check if user exist
  var myrequest = await NetworkModel.find({
    email: req.body.emailFromFront
   }) 
  console.log(myrequest)  
  if (myrequest.length != 0) {
    var hash = SHA256(req.body.passwordFromFront + myrequest[0].salt).toString(encBase64)
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
router.post('/sign-up', async function(req,res,next){

// check if network alredy exist
  var networkExist = await NetworkModel.findOne({
    email: req.body.emailFromFront 
  })
  
  if (networkExist != null) {

    res.json({
      succes: false,
      alert: 'Network with this email already exists'
    })
  } else {
    // encrypt password
    var userSalt = uid2(32)
    // add user
     var newNetwork = await new NetworkModel({
      firstName: req.body.firstnameFromFront,
      lastName: req.body.lastnameFromFront,
      businessName : req.body.businessnameFromFront,
      phone: req.body.phoneFromFront,
      adress: req.body.adressFromFront,
      zipCode: req.body.zipcodeFromFront,
      city: req.body.cityFromFront,
      email: req.body.emailFromFront,
      webSite: req.body.websiteFromFront,
      refoundType: req.body.refoundtypeFromFront,
      zoneAction: req.body.zoneactionFromFront,
      password: SHA256(req.body.password + userSalt).toString(encBase64),
      token: uid2(32),
      salt: userSalt,
      imageUrl : req.body.imageFromFront
    })
  
    var networkSaved = await newNetwork.save();
    console.log(networkSaved)
    // send a succes and token
      res.json({
        succes: true,
        alert: 'New network saved',
        token: networkSaved.token 
      })
    }
  })

//     res.render('form/feedChoice')
//   } else {
//     console.log('existe déjà')
//     res.render('form/signUp')
//   } 
// })


// /* Logout */
// router.get('/logout', function(req,res,next){

//   req.session.network = null;

//   res.redirect('/')
// })

module.exports = router;