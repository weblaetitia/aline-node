var express = require('express');
var router = express.Router();

/* GET backoffice page. */
router.get('/backoffice', function(req, res, next) {
  res.send('backoffice page');
});

module.exports = router;