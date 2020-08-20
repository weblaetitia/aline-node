var express = require('express');
var router = express.Router();
var request = require('sync-request');

if(!process.env.DB_INFO){
    require('dotenv').config()
}
  
const PlaceModel = require('../models/placeModel');

router.post('/getPlaces', async function(req,res,next){

    console.log('BACKEND getPlaces', req.body)

    if(req.body.name.length>0) {
        var myRequest = await PlaceModel.find({
            name: req.body.name,
           })
    } else if(req.body.network.length>0 && req.body.type.length>0){
        var myRequest = await PlaceModel.find({
            network: req.body.network,
            type: req.body.type
        })
    } else if(req.body.network.length>0) {
        var myRequest = await PlaceModel.find({
            network: req.body.network
        })
    } else if(req.body.type.length>0) {
        var myRequest = await PlaceModel.find({
            type: req.body.type
        })
    } else {
        var myRequest = []
    }

    res.json(myRequest)
})

module.exports = router;