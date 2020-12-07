var express = require('express');
var router = express.Router();
const knex = require('../database/knex');

var SHA256 = require('crypto-js/sha256')
var encBase64 = require('crypto-js/enc-base64')
var uid2 = require('uid2')

/* GET GET GET GET GET GET GET GET GET GET GET */

/* GET all TABLES */
router.get('/:table/', function(req, res, next) {
    knex.select().from(req.params.table)
        .then(function(data) {
            res.send(data)
        })
})

// une autre façon de l'écrire
router.get('/v2/:table', function (req, res) {
    knex.raw(`select * from ${req.params.table}`)
    .then(function(datas) {
        res.send(datas.rows)
    })
})

/* GET ONE item by ID */
router.get('/:table/:id', function(req, res) {
    knex.select().from(req.params.table).where('id', req.params.id)
        .then(function(data) {
            res.send(data)
        })
})


/* ------------------------------------------- */
/* POST POST POST POST POST POST POST POST POST */

/* POST new users */
router.post('/add-user', function(req, res, next) {
    // encrypt password
    const userSalt = uid2(32)
    // get date
    var datetime = new Date()
    knex.insert({
        // l'id est généré par postgres
        type: req.body.type,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone_number: req.body.phone_number,
        email: req.body.email,
        password: SHA256(req.body.password + userSalt).toString(encBase64),
        token: uid2(32),
        salt: userSalt,
        created_at: datetime,
        // last_login: ""
    }).returning('*').into('users')
    .then(function(data) {
        res.send(data)
    })
})

/* POST new product */
router.post('/add-product', function(req, res) {
    
    // get network name
    knex.select().from('networks').where('id', req.body.network_id)
    .then(function(data) {

        // generate keywords with network name, product name, brand name
        var keywords = [];
        var nameSplit = req.body.name.toLowerCase().split(' ')
        var brandSplit = req.body.brand.toLowerCase().split(' ')
        var networkName = data[0].business_name.toLowerCase().split(' ')
        var keywords = nameSplit.concat(brandSplit).concat(networkName)
                
        knex.insert({
            // l'id est généré par postgres
            network_id: req.body.network_id,
            name: req.body.name,
            brand: req.body.brand,
            type: req.body.type,
            refound_price: req.body.refound_price,
            barcode: req.body.barcode,
            qr_url: req.body.qr_url,
            image_url: req.body.image_url,
            keywords: keywords,
        }).returning('*').into('products')
        .then(function(data) {
            res.send(data)
        })
    })
})

/* POST new network */
router.post('/add-network', function(req, res, next) {
    knex.insert({
        // l'id est généré par postgres
        user_id: req.body.user_id,
        business_name: req.body.business_name,
        address: req.body.address,
        zip_code: req.body.zip_code,
        city: req.body.city,
        website: req.body.website,
        deposite_type: req.body.deposite_type,
        image_url: req.body.image_url,
    }).returning('*').into('networks')
    .then(function(data) {
        res.send(data)
    })
})

/* POST new place */
router.post('/add-place', function(req, res, next) {
    
    // opening hours
    const opening = ["Lundi: 09:30 – 12:30, 14:30 – 18:30","Mardi: 09:30 – 12:30, 14:30 – 18:30","Mercredi: 09:30 – 12:30, 14:30 – 18:30","Jeudi: 09:30 – 12:30, 14:30 – 18:30","Vendredi: 09:30 – 12:30, 14:30 – 18:30","Samedi: 09:30 – 12:30, 14:30 – 18:30","Dimanche: Fermé"]
     // generate keywords with network name, product name, brand name
     var keywords = [];
     var nameSplit = req.body.name.toLowerCase().split(' ')
     var citySplit = req.body.city.toLowerCase().split(' ')
     keywords = nameSplit.concat(citySplit)

    var services = ["Contenants consignés"]

    knex.insert({
        // l'id est généré par postgres
        network_id: req.body.network_id,
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        zip_code: req.body.zip_code,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        website: req.body.website,
        type: req.body.type,
        services: services, // array
        google_place_id: req.body.google_place_id,
        image_url: req.body.image_url,
        opening_hours: opening, // array
        keywords: keywords, // array
    }).returning('*').into('places')
    .then(function(data) {
        knex.insert({
            network_id: data[0].network_id,
            place_id: data[0].id,
        }).returning('*').into('network_places')
        .then(function(dataTwo){
            res.send(dataTwo)
        })
    })
})

/* POST new fav */
router.post('/add-fav', function(req, res, next) {
    knex.insert({
        // l'id est généré par postgres
        user_id: req.body.user_id,
        place_id: req.body.place_id,
    }).returning('*').into('user_places')
    .then(function(data) {
        res.send(data)
    })
})




/* ------------------------------------------- */
/* PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT */

/* UPDATE user */
router.put('/update-user/:id', function(req, res, next) {
    const userSalt = uid2(32)
    knex('users').where('id', req.params.id).update( {
        type: req.body.type,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone_number: req.body.phone_number,
        email: req.body.email,
        password: SHA256(req.body.password + userSalt).toString(encBase64),
        token: uid2(32),
        salt: userSalt,
    })
    .then(function() {
        // rafaire un select
        knex.select().from('users')
        .then(function(data) {
            res.send(data)
        })
    })
})

module.exports = router;
