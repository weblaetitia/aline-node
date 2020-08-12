var express = require('express');
var router = express.Router();
var request = require('sync-request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('form/signIn');
});

/* GET signUp page. */
router.get('/network/sign-up', function(req, res, next) {
  res.render('form/signUp');
});




module.exports = router;
