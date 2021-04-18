var express = require('express')
var router = express.Router()
const knex = require('../database/knex')
var SHA256 = require('crypto-js/sha256')
var encBase64 = require('crypto-js/enc-base64')
var uid2 = require('uid2')

/* GET GET GET GET GET GET GET GET GET GET GET */

/* GET all TABLES */
router.get('/:table/', function (req, res, next) {
  knex
    .select()
    .from(req.params.table)
    .then(function (data) {
      res.send(data)
    })
})

// une autre façon de l'écrire
router.get('/v2/:table', function (req, res) {
  knex.raw(`select * from ${req.params.table}`).then(function (datas) {
    res.send(datas.rows)
  })
})

/* GET ONE item by ID */
router.get('/:table/:id', function (req, res) {
  knex
    .select()
    .from(req.params.table)
    .where('id', req.params.id)
    .then(function (data) {
      res.send(data)
    })
})

/* ------------------------------------------- */
/* POST POST POST POST POST POST POST POST POST */

/* POST new users */
router.post('/add-user', async (req, res, next) => {
  const userSalt = uid2(32)
  const datetime = new Date()

  // 1 check if email doesn't exist
  user_exist = await knex('users')
    .where({ email: req.body.email, type: req.body.type })
    .first()
  if (user_exist) {
    res.send('user exist')
    return
  }
  // 2 insert
  const new_user = await knex
    .insert({
      type: req.body.type,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone_number: req.body.phone_number,
      password: SHA256(req.body.password + userSalt).toString(encBase64),
      token: uid2(32),
      salt: userSalt,
      created_at: datetime,
    })
    .returning('*')
    .into('users')
  if (new_user) {
    res.send(new_user) // send an array with one object [{}]
  }
})

/* POST new network */
router.post('/add-network', async (req, res, next) => {
  // 1 check if network doesn't exist
  // TODO: make a case insensitive search
  network_exist = await knex('networks')
    .where({ business_name: req.body.business_name })
    .first()
  if (network_exist) {
    res.send('network exist')
    return
  }
  // 2 search network_user and add network
  const network_user = await knex('users')
    .where({ token: req.body.token })
    .first()
  if (network_user) {
    const new_network = await knex('networks')
      .insert({
        user_id: network_user.id,
        business_name: req.body.business_name,
        address: req.body.address,
        zip_code: req.body.zip_code,
        city: req.body.city,
        website: req.body.website,
        deposite_type: req.body.deposite_type,
        image_url: req.body.image_url,
      })
      .returning('*')
      .into('networks')
    if (new_network) {
      res.send(new_network) // send an array with one object [{}]
    }
  } else {
    res.send('something went wrong with user')
  }
})

/* POST new product */
router.post('/add-product', async (req, res) => {
  // get user name
  const user = await knex('users').where('token', req.body.token).first()
  // get network
  if (user) {
    const network = await knex('networks').where({ user_id: user.id }).first()
    if (network) {
      // add product
      // generate keywords with network name, product name, brand name
      let keywords = []
      const nameSplit = req.body.name.toLowerCase().split(' ')
      const brandSplit = req.body.brand.toLowerCase().split(' ')
      const networkName = network.business_name.toLowerCase().split(' ')
      keywords = nameSplit.concat(brandSplit).concat(networkName)
      const product = await knex
        .insert({
          network_id: network.id,
          name: req.body.name,
          brand: req.body.brand,
          type: req.body.type,
          refound_price: req.body.refound_price,
          barcode: req.body.barcode,
          qr_url: req.body.qr_url,
          image_url: req.body.image_url,
          keywords: keywords,
        })
        .returning('*')
        .into('products')
      if (product) {
        res.send(product) // send an array with one object [{}]
      }
    } else {
      res.send('something whent wrong with network')
    }
  } else {
    res.send('something whent wrong with user')
  }
})

/* POST new place */
router.post('/add-place', async (req, res, next) => {
  // generate keywords with network name, product name, brand name
  let keywords = []
  const nameSplit = req.body.name.toLowerCase().split(' ')
  const citySplit = req.body.city.toLowerCase().split(' ')
  keywords = nameSplit.concat(citySplit).concat([type])
  const services =
    req.body.type === 'restaurant'
      ? ['Boîtes repas consignés']
      : ['Produits alimentaires consignés']

  // 1 inserer le lieu dans la table places
  const user = await knex('users').where({ token: req.body.token }).first()
  if (!user) {
    res.send("something went wrong: can't find user")
    return
  }
  const network = await knex('networks').where({ user_id: user.id }).first()
  if (!network) {
    res.send('Something went wrong: can\t find network')
    return
  }
  const place = await knex
    .insert({
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
      opening_hours: req.body.opening_hours, // array
      keywords: keywords, // array
      products: req.body.products, // array of product.id
    })
    .returning('*')
    .into('places') // return an array with one object[{}]
  if (!place) {
    res.send('Something went wrong: can\t write place in db')
    return
  }
  // 2 inserer le lieu dans la table de jonction network_places [network_id, place_id]
  const network_places = await knex
    .insert({
      network_id: network.id,
      place_id: place[0].id,
    })
    .returning('*')
    .into('network_places')
  if (!network_places) {
    res.send('Something went wrong: can\t write place in network_places')
    return
  }
  // 3 inserer le lieu dans la table de jonction product_places [product_id, place_id]
  const place_products = await knex('place_product').insert(
    req.body.products.map((product) => {
      return {
        place_id: place[0].id,
        product_id: product,
      }
    })
  )
})

/* POST new fav */
router.post('/add-fav', function (req, res, next) {
  knex
    .insert({
      // l'id est généré par postgres
      user_id: req.body.user_id,
      place_id: req.body.place_id,
    })
    .returning('*')
    .into('user_places')
    .then(function (data) {
      res.send(data)
    })
})

/* ------------------------------------------- */
/* PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT PUT */

/* UPDATE user */
router.put('/update-user/:id', function (req, res, next) {
  const userSalt = uid2(32)
  knex('users')
    .where('id', req.params.id)
    .update({
      type: req.body.type,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone_number: req.body.phone_number,
      email: req.body.email,
      password: SHA256(req.body.password + userSalt).toString(encBase64),
      token: uid2(32),
      salt: userSalt,
    })
    .then(function () {
      // rafaire un select
      knex
        .select()
        .from('users')
        .then(function (data) {
          res.send(data)
        })
    })
})

module.exports = router
