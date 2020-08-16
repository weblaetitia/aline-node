var express = require('express');
var router = express.Router();
var request = require('sync-request');


var NetworkModel = require('../models/networkModel')

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



module.exports = router;
