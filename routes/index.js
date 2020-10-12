var express = require('express');
var router = express.Router();
var request = require('sync-request');


var NetworkModel = require('../models/networkModel')
var PlaceModel = require('../models/placeModel');
const SubscriptionModel = require('../models/subscriptionModel');

/* DEV MODE a efacer en prod !!!  */
router.get('/dev-log', function(req, res, next) {
  req.session.token = "TYWgwwiZEy0fzZKUpYwfFtaXxShh4DZB"
  req.session.businessName = "Looper"
  res.render('form/feedChoice', {token: req.session.token, businessName: req.session.businessName});
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET sign in page. */
router.get('/sign-in', function(req, res, next) {
  res.render('form/signIn');
});

/* GET signUp page. */
router.get('/sign-up', function(req, res, next) {
  res.render('form/signUp');
});

/* get email from home-page  */
router.post('/subscription', async function(req, res, next) {
  // verifier si le champ est rempli
  if (!req.body.emailFromFront) {
    console.log('emptyyyy')
    res.render('index', { subscription: 'empty' })
  } else {
  // verifier si l'email existe
  var email = await SubscriptionModel.findOne({
    email: req.body.emailFromFront
  }) 

  if (email) {
    console.log(`email gggg existe déjà`)
    res.render('index', { subscription: 'exist' })
  } else {
    // enregistrer l'email en bdd
    var date = new Date()
    var newSub = await SubscriptionModel( {
      created: date,
      email: req.body.emailFromFront
    })
    var newSubSaved = await newSub.save()
    if (newSubSaved) {
      res.render('index', { subscription: 'ok' })
    } else {
      //erreur d'enregistrement -> on redirige vers la page d'error
      res.redirect('/error', { message: 'erreur d\'enregistrement dans la base de donnée' })
    }
  }
  }

  

})

module.exports = router;
