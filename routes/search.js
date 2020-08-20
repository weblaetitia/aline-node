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
  console.log('REQ.BODY =====', req.body)
  var search=req.body.dataProducts;
  if(search.length == 13 && typeof parseInt(search) == "number"){
      searchElements = parseInt(search);
      res.redirect('/search/search-barcode');
    }else{
      searchElements = search.toLowerCase();
      res.redirect('/search/search-all')
    }
});


/* Get search-all */
router.get('/search-all', async function(req,res,next){
    // console.log(searchElements, "a")
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
            console.log('ok produit trouvé :')
            productsArray.push(product)
          }
        })
      })
    })

    
    var places = await PlaceModel.find()
    places.forEach((place) => {
      place.keywords.forEach((keyword) => {
        console.log(searchElements)
        console.log(keyword)
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
        console.log('trouvé')
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

