var express = require('express');
var router = express.Router();
var request = require('sync-request');
var searchElements;

if(!process.env.DB_INFO){
    require('dotenv').config()
  }

var NetworkModel = require('../models/networkModel')
const PlaceModel = require('../models/placeModel');



/* Post search */
router.post('/search', async function(req,res,next){
  var search=req.body.dataProducts;
  if(search.length == 13 && typeof parseInt(search) == "number"){
      searchElements = parseInt(search);
      res.redirect('/search/search-barcode');
    }else{
      searchElements = search.toLowerCase();
      res.redirect('/search/search-all')
    }
});

/* get network-img */
router.get('/get-network-img/', async function(req,res,next){
  
  var network = await NetworkModel.findOne({
    businessName: req.query.network
  })
  if(network) {
    res.json({networkImg: network.imageUrl})
  }
  
});


/* Get search-all */
router.get('/search-all', async function(req,res,next){
     if(req.query.data){
      searchElements = req.query.data
    }

    searchElements = searchElements.split(' ')
    var productsArray = [];
    var placesArray = [];

    var networks = await NetworkModel.find()

    networks.forEach((network) => {
      network.products.forEach((product) => {
        product.keywords.forEach((keyword) =>{
          if (searchElements.includes(keyword)) {
            var newProduct = {
            _id: product._id,
            name: product.name,
            brand: product.brand,
            type:product.type,
            refoundPrice: product.refoundPrice,
            barCode: product.barCode,
            imageUrl: product.imageUrl,
            network: network.businessName,
            networkImgUrl: network.imageUrl,
            }
            productsArray.push(newProduct)
          }
        })
      })
    })

    
    var places = await PlaceModel.find()
    places.forEach((place) => {
      place.keywords.forEach((keyword) => {
        if (searchElements.includes(keyword)) {
          placesArray.push(place)
        }
      })
    })

    res.json({productsArray, placesArray})
});



/* Get search-barcode */ 
router.get('/search-barcode', async function(req,res,next){
  if(req.query.data){
    searchElements = parseInt(req.query.data)
  }

  var infos = false
  var networks = await NetworkModel.find()
  networks.forEach((network) => {
    network.products.forEach((prod) => {
      if (prod.barCode == searchElements) {
        infos = {
        name: prod.name,
        brand: prod.brand,
        refoundPrice: prod.refoundPrice,
        imageUrl: prod.imageUrl,
        barCode: prod.barCode,
        network: prod.ownerDocument().businessName,
        networkImgUrl: prod.ownerDocument().imageUrl,
        }
      }
    })
  })
 
  res.json(infos)
})


module.exports = router;

