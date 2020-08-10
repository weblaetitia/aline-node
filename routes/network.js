var express = require('express');
var router = express.Router();

var networkModel = require('../models/networkModel')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/sign-in', async function(req,res,next){

  var searchNetwork = await networkModel.findOne({
    email: req.body.emailFromFront,
    password: req.body.passwordFromFront
  })

  if(searchNetwork!= null){
    req.session.user = {
      name: searchNetwork.networkname,
      id: searchNetwork._id
    }
    res.redirect('/feedChoice')
  } else {
    res.render('login')
  }

  
})

router.post('/sign-up', async function(req,res,next){

  var searchNetwork = await networkModel.findOne({
    email: req.body.emailFromFront
  })
  
  if(!searchNetwork){
    var newNetwork = new networkModel({
      firstname: req.body.firstnameFromFront,
      lastname: req.body.lastnameFromFront,
      businessname: req.body.businessnameFromFront,
      adress: req.body.adressFromFront,
      zipcode: req.body.zipcodeFromFront,
      city: req.body.cityFromFront,
      website: req.body.websiteFromFront,
      refoundtype: req.body.refoundtypeFromFront,
      email: req.body.emailFromFront,
      password: req.body.passwordFromFront,
    })
  
    var newNetworkSave = await newNetwork.save();
  
    req.session.user = {
      firstname: newNetworkSave.firstname,
      id: newNetworkSave._id,
    }
  
    console.log(req.session.network)
  
    res.redirect('/')
  } else {
    res.redirect('/')
  }
  
})



router.get('/logout', function(req,res,next){

  req.session.network = null;

  res.redirect('/login')
})