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
if ((req.body.emailFromFront.length == 0) || (req.body.passwordFromFront.length == 0)) {
  res.render('form/signIn', {status: 'loginfailed'})
  console.log('veuillez remplir tous les champs')
} else {
  // all fields are provided now check if user exist
  var myrequest = await NetworkModel.find({
    email: req.body.emailFromFront
   }) 
   if (myrequest.length != 0) {
    var hash = SHA256(req.body.passwordFromFront + myrequest[0].salt).toString(encBase64)
    if (hash == myrequest[0].password) {
      // succes
      req.session.token = myrequest[0].token
      res.render('form/feedChoice')
    } else {
      // unsuccess
      res.render('form/signIn', {status: 'login-failed'})
      console.log('wrong email or password')
    }

  } else {
    // unsuccess
    res.render('form/signIn', {status: 'loginfailed'})
    console.log('wrong email or password')
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
    res.render('form/signUp', {status: 'signup-failed'})
    console.log('Network with this email already exists')
    
  } else {
    // encrypt password
    var networkSalt = uid2(32)
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
      password: SHA256(req.body.passwordFromFront + networkSalt).toString(encBase64),
      token: uid2(32),
      salt: networkSalt,
      imageUrl : req.body.imageFromFront
    })
    var networkSaved = await newNetwork.save();
    if (networkSaved) {
      // sucess 
      // store token
      req.session.token = networkSaved.token
      res.render('form/feedChoice')
      } else {
        res.render('form/signUp', {status: 'signup-failed'})
        console.log('ooops something went wrong')
      }
    }
  })


module.exports = router;