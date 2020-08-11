var express = require('express');
var router = express.Router();
var request = require('sync-request');

/* variable des models pour le formulaire */
var networkModel = require('../models/networkModel')
var placeModel = require('../models/placeModel')


// var data = request("GET", 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+ name +'&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyDQaLlOzRuURHp-Hms_PRoh9YI69tCm8nw')
// var dataAPI = JSON.parse(data.body)

/* GET feed choices page. */
router.get('/feedChoice', function(req, res, next) {
  res.render('form/feedChoice');
  });

/* GET form for restaurant page. */
router.get('/formRestaurant', function(req, res, next) {
  res.render('form/formRestaurant');
  });

/* GET form for shop page. */
router.get('/formShop', function(req, res, next) {
  res.render('form/formShop');
  });


/* GET API for restaurant form. */
router.post('/update-formRestaurant', async function(req, res, next){
  console.log('placeName', req.body.placeName)
  var data = request("GET", 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+ req.body.placeName +'&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyDQaLlOzRuURHp-Hms_PRoh9YI69tCm8nw')
  var dataAPI = JSON.parse(data.getBody())
  console.log('dataGoogle', dataAPI)

  res.render('form/formRestaurant')
})


/* GET API for shop form. */
router.post('/update-formShop', async function(req, res, next){
  console.log('placeName', req.body.placeName)
  var data = request("GET", 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+ req.body.placeName +'&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyDQaLlOzRuURHp-Hms_PRoh9YI69tCm8nw')
  var dataAPI = JSON.parse(data.getBody())
  console.log('dataGoogle', dataAPI)

  res.render('form/formShop')
})


/* GET form for product page. */
router.get('/formProduct', function(req, res, next) {
  res.render('form/formProduct');
  });

/* GET thanks page. */
router.get('/formThanks', function(req, res, next) {
  res.render('form/formThanks');
  });



module.exports = router;
