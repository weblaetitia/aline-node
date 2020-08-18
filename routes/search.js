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
      searchElements = search;
      res.redirect('/search/search-all')
    }
});


/* Get search-all */
router.get('/search-all', async function(req,res,next){
    // console.log(searchElements, "a")
     if(req.query.data){
      searchElements = req.query.data
    }

    var myrequest = await NetworkModel.find()
    
    var result = []
    for(let i=0; i<myrequest.length; i++){
     
      for(let j=0; j<myrequest[i].products.length; j++){
          var searchProduct = myrequest[i].products[j].keywords
          // console.log(searchProduct, "b")
          if(searchProduct.includes(searchElements)){
              result.push(myrequest[i].products[j])
          }  
      }
    };

 
    var myrequest = await PlaceModel.find()
    // console.log(myrequest)
    for(let i=0; i<myrequest.length; i++){

      // console.log(myrequest[i], 'hello', i)
          let searchPlace = myrequest[i]
          console.log('search place', searchPlace.keywords)
         
          //  if(searchPlace.includes(searchElements)){
          //     result.push(myrequest[i])
          // }   
    };
    console.log(result)

    res.json(result)
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

