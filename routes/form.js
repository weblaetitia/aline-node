var express = require('express');
var router = express.Router();
var request = require('sync-request');

if(!process.env.DB_INFO){
  require('dotenv').config()
}


/* variable des models pour le formulaire */
const PlaceModel = require('../models/placeModel');
const NetworkModel = require('../models/networkModel');
const { findOne } = require('../models/placeModel');


/* GET feed choices page. */
router.get('/feedChoice', function(req, res, next) {
  res.render('form/feedChoice', {token: req.session.token});
  });

/* GET form for restaurant page. */
router.get('/formRestaurant', function(req, res, next) {
  res.render('form/formRestaurant', {token: req.session.token});
  });

/* GET form for shop page. */
router.get('/formShop', function(req, res, next) {
  res.render('form/formShop', {token: req.session.token});
  });

/* GET form for product page. */
router.get('/formProduct', function(req, res, next) {
  res.render('form/formProduct', {token: req.session.token});
  });



/* POST add-restaurant */
router.post('/add-place', async function(req, res, next){
  console.log(req.body.products) // tableau des id de produits // à traiter
  console.log(req.body.services) // tableaux

  // get network from token
  var network = await NetworkModel.findOne({
    token: req.body.networktoken
  })

  var networkName = network.businessName

  console.log(networkName)


  var newRestaurant = await PlaceModel( {
    name: req.body.name,
    adress: req.body.address,
    city: req.body.city,
    phone: req.body.phone,
    webSite: req.body.website,
    services: req.body.services,
    google_place_id: req.body.place_id,
    network: networkName,
    type: req.body.type,
    latitude: req.body.place_lat,
    longitude: req.body.place_lng,
    // products: {sous document},
    // zipCode: Number,
    // imageUrl: String,
    // description: String,
  } )
  var retaurantSaved = await newRestaurant.save()

  console.log(retaurantSaved)

  if (retaurantSaved) {
    res.render('form/feedChoice', {formSucces: true }, {token: req.session.token})
  } else {
    res.render('form/feedChoice', {formSucces: false }, {token: req.session.token})
  }
})


/* POST add-product */
router.post('/add-product', async function(req, res, next){
  var network = await NetworkModel.findOne({
    businessName: req.body.networktoken // recupere le reseau par son token
  })
  network.products.push({
    name: req.body.name,
    brand: req.body.brand,
    type: req.body.type,
    refoundPrice: req.body.price,
    barCode: req.body.code,
    imageUrl: req.body.imgUrl,
  })
  var networkSaved = await network.save()
  if (networkSaved) {
    res.render('form/feedChoice', {formSucces: true }, {token: req.session.token})
  } else {
    res.render('form/feedChoice', {formSucces: false }, {token: req.session.token})
  }
})






module.exports = router;
