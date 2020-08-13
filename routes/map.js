var express = require('express');
var router = express.Router();
var request = require('sync-request');

if(!process.env.DB_INFO){
    require('dotenv').config()
}
  
const PlaceModel = require('../models/placeModel');

router.post('/getPlaces', async function(req,res,next){

    var myrequest = await PlaceModel.find({
        network: req.body.networkFromFront
       })

    res.json(myrequest)
})

module.exports = router;