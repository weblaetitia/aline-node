var express = require('express');
var router = express.Router();
var request = require('sync-request');

if(!process.env.DB_INFO){
  require('dotenv').config()
}

var placeApi = process.env.GOOGLE_API_KEY

/* variable des models pour le formulaire */
var networkModel = require('../models/networkModel')
var placeModel = require('../models/placeModel');
const PlaceModel = require('../models/placeModel');

/* GET feed choices page. */
router.get('/feedChoice', function(req, res, next) {
  res.render('form/feedChoice');
  });

/* GET form for restaurant page. */
router.get('/formRestaurant', function(req, res, next) {
  res.render('form/formRestaurant', {placeApi: placeApi});
  });

/* GET form for shop page. */
router.get('/formShop', function(req, res, next) {
  res.render('form/formShop');
  });


/* GET API for restaurant form. */
router.post('/update-formRestaurant', async function(req, res, next){
  console.log('placeName', req.body.placeName)
  var data = request("GET", 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+ req.body.placeName +`&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=${process.env.GOOGLE_API_KEY}`)
  var dataAPI = JSON.parse(data.getBody())
  console.log('dataGoogle', dataAPI)

  res.render('form/formRestaurant')
})


/* GET API for shop form. */
router.post('/update-formShop', async function(req, res, next){
  console.log('placeName', req.body.placeName)
  var data = request("GET", 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+ req.body.placeName +`&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=${process.env.GOOGLE_API_KEY}`)
  var dataAPI = JSON.parse(data.getBody())
  console.log('dataGoogle', dataAPI)

  res.render('form/formShop')
})

/* POST add-restaurant */
router.post('/add-restaurant', async function(req, res, next){
  console.log(req.body.products)
  console.log(req.body.services)
  console.log('--------------------')

  var newRestaurant = await PlaceModel( {
    name: req.body.name,
    adress: req.body.address,
    city: req.body.city,
    phone: req.body.phone,
    webSite: req.body.website,
    services: req.body.services,
    google_place_id: req.body.place_id,
    network: req.body.network,
    type: req.body.type,
    products: req.body.products,
    latitude: req.body.place_lat,
    longitude: req.body.place_lng,
    // zipCode: Number,
    // imageUrl: String,
    // description: String,
  } )
  var retaurantSaved = await newRestaurant.save()

  console.log(retaurantSaved)

  if (retaurantSaved) {
    res.render('form/feedChoice', {formSucces: true })
  } else {
    res.render('form/feedChoice', {formSucces: false })
  }

  
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
