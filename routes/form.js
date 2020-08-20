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
router.get('/formRestaurant', async function(req, res, next) {
   // get products and send them to the front
   var network = await NetworkModel.findOne({
    token: req.session.token
  })
  var products = network.products
  res.render('form/formRestaurant', {token: req.session.token, products});
  });

/* GET form for shop page. */
router.get('/formShop', async function(req, res, next) {
  // get products and send them to the front
  var network = await NetworkModel.findOne({
    token: req.session.token
  })
  var products = network.products
  res.render('form/formShop', {token: req.session.token, products});
  });

/* GET form for product page. */
router.get('/formProduct', function(req, res, next) {
  res.render('form/formProduct', {token: req.session.token});
  });



/* POST add-place (restaurant and shop) */
router.post('/add-place', async function(req, res, next){

  // get network from token
  var network = await NetworkModel.findOne({
    token: req.body.networktoken
  })
  var networkName = network.businessName

  // get productList from this network
  var networkProducts = network.products // []
  console.log('PRODUCTS ====', req.body.products.length)

  
  // get placeProducts infos
  var placeProducts = []
  networkProducts.forEach(networkProd => {
    
    if (Array.isArray(req.body.products)) {
      req.body.products.forEach(reqProd => {
        if (reqProd == networkProd._id) {
          placeProducts.push(networkProd)
        }
      })
    } else {
      if (req.body.products == networkProd._id) {
        placeProducts.push(networkProd)
      }
    }
  })

  console.log(req.body.placeImg)
  console.log(req.body.openingHours)

  // enregistrer la place en bdd
  var newPlace = await PlaceModel( {
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
    products: placeProducts,
    placeImg: req.body.placeImg,
    openingHours : req.body.openingHours,
    // zipCode: Number,
    // imageUrl: String,
    // description: String,
  } )
  var placeSaved = await newPlace.save()


  if (placeSaved) {
    // faire un redirect au lieu de render ?
    res.render('form/feedChoice', {formSucces: true, token: req.session.token})
  } else {
    res.render('form/feedChoice', {formSucces: false, token: req.session.token})
  }
})


/* POST add-product */
router.post('/add-product', async function(req, res, next){
  var network = await NetworkModel.findOne({
    token: req.body.networktoken // recupere le reseau par son token
  })
  var keywords = [];
  var nameSplit = req.body.name.toLowerCase().split(' ')
  var brandSplit = req.body.brand.toLowerCase().split(' ')
  var keywords = nameSplit.concat(brandSplit)
  
  keywords = [...new Set(keywords)]

   network.products.push({
    name: req.body.name,
    brand: req.body.brand,
    type: req.body.type,
    refoundPrice: req.body.price,
    barCode: req.body.barcode,
    imageUrl: req.body.imgUrl,
    keywords: keywords
  })

  var networkSaved = await network.save()
  if (networkSaved) {
    res.render('form/feedChoice', {formSucces: true, token: req.session.token})
  } else {
    res.render('form/feedChoice', {formSucces: false, token: req.session.token})
  }
});


module.exports = router;
