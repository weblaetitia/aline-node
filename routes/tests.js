var express = require('express');
var router = express.Router();
const knex = require('../database/knex');

const Users = require('../models/Users');

/* GET USERS  */
router.get('/users', function(req, res, next) {
    knex.select().from('users')
        .then(function(data) {
            res.send(data)
        })
});

/* POST new users */
router.post('/addusers', function(req, res, next) {
    knex.insert(req.body).returning('*').into('users')
    .then(function(data) {
        res.send(data)
    })
})



module.exports = router;
