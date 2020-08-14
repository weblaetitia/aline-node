var express = require('express');
var router = express.Router();
var request = require('sync-request');

if(!process.env.DB_INFO){
    require('dotenv').config()
  }

var NetworkModel = require('../models/networkModel')


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
})


module.exports = router;

