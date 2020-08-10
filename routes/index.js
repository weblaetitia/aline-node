var express = require('express');
var router = express.Router();
var request = require('sync-request');

/* variable des models pour le formulaire */
var networkModel = require('../models/networkModel')
var placeModel = require('../models/placeModel')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('form/signIn');
});

/* GET signUp page. */
router.get('/signUp', function(req, res, next) {
  res.render('form/signUp');
});




module.exports = router;
