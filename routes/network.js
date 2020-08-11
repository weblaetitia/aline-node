var express = require('express');
var router = express.Router();

var NetworkModel = require('../models/networkModel')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/sign-in', async function(req,res,next){

  var searchNetwork = await NetworkModel.findOne({
    email: req.body.emailFromFront
  })

  if(searchNetwork!= null){
    req.session.network = {
      email: searchNetwork.networkemail,
      id: searchNetwork._id
    }
    res.redirect('/feedChoice')
  } else {
    res.render('signIn')
  }
  
})

router.post('/sign-up', async function(req,res,next){

  var searchNetwork = await NetworkModel.findOne({
    email: req.body.emailFromFront
  })
  
  if(searchNetwork == null){
    var newNetwork = new NetworkModel({
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
      password: req.body.passwordFromFront,
    })
  
    var newNetworkSave = await newNetwork.save();
  
    req.session.network = {
      firstName: newNetworkSave.firstName,
      id: newNetworkSave._id,
    }
  
    console.log(req.session.network)
  
    res.redirect('/feedChoice')
  } else {
    console.log('moche')
    res.render('form/signUp')
  }
  
})



router.get('/logout', function(req,res,next){

  req.session.network = null;

  res.redirect('/')
})

module.exports = router;