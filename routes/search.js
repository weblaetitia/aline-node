var express = require('express');
var router = express.Router();
var request = require('sync-request');
var searchElements;

if(!process.env.DB_INFO){
    require('dotenv').config()
  }

var NetworkModel = require('../models/networkModel')



/* Post search */
router.post('/search', async function(req,res,next){

  var search = req.body.dataProducts;

  if(search.length == 13){
    if(typeof parseInt(search) == "number"){
      searchElements = parseInt(search);
      res.redirect('/search/search-barcode');
    }else{
      res.redirect('/search/search-product')
    }
  }else{
    res.json(false)
  }

});




/* Post search-product */
router.post('/search-product', async function(req,res,next){

    var myrequest = await NetworkModel.find()
    
    var result = []
    for(let i=0; i<myrequest.length; i++){
     
      for(let j=0; j<myrequest[i].products.length; j++){
          var searchProduct = myrequest[i].products[j].keyword
          console.log(searchProduct)
          if(searchProduct.includes(req.body.dataProducts)){
              result.push(myrequest[i].products[j])

          }
          
      }
    };
    console.log(result)

    res.json(result)
});



/* Post search-barcode */ 
router.post('/search-barcode', async function(req,res,next){

  var myrequest = await NetworkModel.find()
    
  for(let i=0; i<myrequest.length; i++){
    for(let j=0; j<myrequest[i].products.length; j++){

        var searchCodeProduct = myrequest[i].products[j].barCode
        if(searchCodeProduct.includes(searchElements)){
          // console.log(myrequest[i].products[j])
          res.json(myrequest[i].products[j]);
        }

    }
  };

  res.json(false)
})


module.exports = router;
