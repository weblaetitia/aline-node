var express = require('express');
var router = express.Router();
var request = require('sync-request');


var NetworkModel = require('../models/networkModel')
var PlaceModel = require('../models/placeModel')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('form/signIn');
});

/* GET signUp page. */
router.get('/network/sign-up', function(req, res, next) {
  res.render('form/signUp');
});


// ajouter des barcodes dans les produits
router.get('/add-barcode', async function(req, res, next) {

  var networks = await NetworkModel.find()
  networks.forEach((network) => {
    network.products.forEach((prod) => {
      var number = Math.floor((Math.random()+3)*1000000000000)
      prod.barCode = number
    })
     network.save()
  })
  
  res.json({sucess: true});
});


// ajouter une liste de keywords dans chaque produit
router.get('/add-keywords', async function(req, res, next) {
  var exclude = ['la', 'le', 'les', 'de', 'des', 'du', 'à', 'aux', 'à']
  var networks = await NetworkModel.find()
  networks.forEach((network) => {
    network.products.forEach((prod) => {
    // create keywords array
    var keywords = [];
    var nameSplit = prod.name.toLowerCase().split(' ')
    var brandSplit = prod.brand.toLowerCase().split(' ')
    var keywords = nameSplit.concat(brandSplit)
    keywords = [...new Set(keywords)]

    exclude.forEach((fil) => {
      keywords = keywords.filter(word => word != fil)
    })
    console.log(keywords)
    
    // add keywords array to each product
    prod.keywords = keywords
    })
    network.save()
  })
})


// ajouter une liste de keywords pour chaque places
router.get('/add-places-keywords', async function(req, res, next) {
  var exclude = ['la', 'le', 'les', 'de', 'des', 'du', 'à', 'aux', 'à', '-']
  var places = await PlaceModel.find()
  
  places.forEach((place) => {
    // create keywords array
    var keywords = [];
    var nameSplit = place.name.toLowerCase().split(' ')
    var city = place.city.toLowerCase()
    var type = place.type.toLowerCase()
    var keywords = nameSplit.concat(city, type)
    if (type == 'shop') {
      keywords.push('magasin', 'boutique', 'supermarché')
    }

    if (type == 'restaurant') {
      keywords.push('café', 'traiteur')
    }
    keywords = [...new Set(keywords)]

    exclude.forEach((fil) => {
      keywords = keywords.filter(word => word != fil)
    })
    // console.log(keywords)
    place.keywords = keywords
    place.save()
  })
  
})

module.exports = router;
