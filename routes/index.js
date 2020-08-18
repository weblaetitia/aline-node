var express = require('express');
var router = express.Router();
var request = require('sync-request');


var NetworkModel = require('../models/networkModel')
var PlaceModel = require('../models/placeModel')

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


// ajouter une liste de keywords dans chaque produit
router.get('/add-keywords', async function(req, res, next) {
  var exclude = ['la', 'le', 'les', 'de', 'des', 'du', 'à', 'aux', 'à']
  var networks = await NetworkModel.find()
  networks.forEach((network) => {
    network.products.forEach((prod) => {
    // create keywords array
    var keywords = [];
    var nameSplit = prod.name.toLowerCase().split(' ')
    var brandSplit = prod.brand.toLowerCase().split(' ')
    var keywords = nameSplit.concat(brandSplit)
    keywords = [...new Set(keywords)]

    exclude.forEach((fil) => {
      keywords = keywords.filter(word => word != fil)
    })
    console.log(keywords)
    
    // add keywords array to each product
    prod.keywords = keywords
    })
    network.save()
  })
})


// ajouter une liste de keywords pour chaque places
router.get('/add-places-keywords', async function(req, res, next) {
  var exclude = ['la', 'le', 'les', 'de', 'des', 'du', 'à', 'aux', 'à', '-']
  var places = await PlaceModel.find()
  
  places.forEach((place) => {
    // create keywords array
    var keywords = [];
    var nameSplit = place.name.toLowerCase().split(' ')
    var city = place.city.toLowerCase()
    var type = place.type.toLowerCase()
    var keywords = nameSplit.concat(city, type)
    if (type == 'shop') {
      keywords.push('magasin', 'boutique', 'supermarché')
    }

    if (type == 'restaurant') {
      keywords.push('café', 'traiteur')
    }
    keywords = [...new Set(keywords)]

    exclude.forEach((fil) => {
      keywords = keywords.filter(word => word != fil)
    })
    // console.log(keywords)
    place.keywords = keywords
    place.save()
  })
  
})


// ajouter services pour chaque places
router.get('/add-places-services', async function(req, res, next) {
 
  // if shop
  var shops = await PlaceModel.find({
    type: 'shop'
  })
  shops.forEach((shop) => {
    if (shop.services == '' || shop.services == undefined || shop.services == ',') {
      shop.services = 'Produits alimentaires avec contenants consignés'
      shop.save()
      // console.log(shop)
    }
  })
  
  // if restaurant
  var restaurants = await PlaceModel.find({
    type: 'restaurant'
  })
  restaurants.forEach((restaurant) => {
    if (restaurant.services == '' || restaurant.services == undefined || restaurant.services == ',') {
      restaurant.services = 'Boîtes repas et couverts consignés'
      restaurant.save()
      // console.log(restaurant)
    }
  })
})

// ajouter services pour chaque places
router.get('/add-places-photos', async function(req, res, next) {

  

 
  // if shop
  // var shops = await PlaceModel.find({
  //   type: 'shop'
  // })
 
  // var images = ['https://res.cloudinary.com/alineconsigne/image/upload/v1597748308/shops/shops-19_rl2d78.jpg',
  //               'https://res.cloudinary.com/alineconsigne/image/upload/v1597748308/shops/shops-18_fw14pv.jpg',
  //               'https://res.cloudinary.com/alineconsigne/image/upload/v1597748307/shops/shops-13_lb3pcb.jpg',
  //               'https://res.cloudinary.com/alineconsigne/image/upload/v1597748307/shops/shops-14_ofnn16.jpg',
  //               'https://res.cloudinary.com/alineconsigne/image/upload/v1597748307/shops/shops-16_eqitzo.jpg',
  //               'https://res.cloudinary.com/alineconsigne/image/upload/v1597748307/shops/shops-15_n7pahl.jpg',
  //               'https://res.cloudinary.com/alineconsigne/image/upload/v1597748307/shops/shops-17_bprdwg.jpg', 
  //               'https://res.cloudinary.com/alineconsigne/image/upload/v1597748307/shops/shops-9_ie3ybb.jpg',
  //               'https://res.cloudinary.com/alineconsigne/image/upload/v1597748306/shops/shops-11_xytrdb.jpg',
  //               'https://res.cloudinary.com/alineconsigne/image/upload/v1597748306/shops/shops-8_kdlhu5.jpg',
  //               'https://res.cloudinary.com/alineconsigne/image/upload/v1597748306/shops/shops-12_mkfxab.jpg',
  //               'https://res.cloudinary.com/alineconsigne/image/upload/v1597748306/shops/shops-6_ejroll.jpg',
  //               'https://res.cloudinary.com/alineconsigne/image/upload/v1597748306/shops/shops-7_abeawg.jpg',
  //               'https://res.cloudinary.com/alineconsigne/image/upload/v1597748306/shops/shops-2_kedl4c.jpg',
  //               'https://res.cloudinary.com/alineconsigne/image/upload/v1597748306/shops/shops-1_g2cc4q.jpg',
  //               'https://res.cloudinary.com/alineconsigne/image/upload/v1597748306/shops/shops-3_jhbzd0.jpg',
  //               'https://res.cloudinary.com/alineconsigne/image/upload/v1597748306/shops/shops-5_tpkbfw.jpg',
  //               'https://res.cloudinary.com/alineconsigne/image/upload/v1597748306/shops/shops-4_iv5r59.jpg'
  //             ]

  // shops.forEach((shop) => {
  //   var randomNum = (Math.floor(Math.random()*18))
  //     shop.placeImg = images[randomNum]
  //     console.log(shop.placeImg)
  //     shop.save()
  // })


  // if restaurant
  var restaurants = await PlaceModel.find({
    type: 'restaurant'
  })

  var images = ['https://res.cloudinary.com/alineconsigne/image/upload/v1597751869/restaurants/restaurants-5_wlmzof.jpg',
                'https://res.cloudinary.com/alineconsigne/image/upload/v1597751869/restaurants/restaurants-1_h77tyy.jpg',
                'https://res.cloudinary.com/alineconsigne/image/upload/v1597751869/restaurants/restaurants-3_vv93i7.jpg',
                'https://res.cloudinary.com/alineconsigne/image/upload/v1597751869/restaurants/restaurants-2_bk7pnq.jpg',
                'https://res.cloudinary.com/alineconsigne/image/upload/v1597751869/restaurants/restaurants-4_bxlmti.jpg',
                'https://res.cloudinary.com/alineconsigne/image/upload/v1597751870/restaurants/restaurants-14_omez5t.jpg',
                'https://res.cloudinary.com/alineconsigne/image/upload/v1597751870/restaurants/restaurants-11_t3cz0f.jpg',
                'https://res.cloudinary.com/alineconsigne/image/upload/v1597751870/restaurants/restaurants-12_nf6ong.jpg',
                'https://res.cloudinary.com/alineconsigne/image/upload/v1597751870/restaurants/restaurants-9_k4brvg.jpg',
                'https://res.cloudinary.com/alineconsigne/image/upload/v1597751870/restaurants/restaurants-7_nu1gkk.jpg',
                'https://res.cloudinary.com/alineconsigne/image/upload/v1597751870/restaurants/restaurants-6_uar3hw.jpg',
                'https://res.cloudinary.com/alineconsigne/image/upload/v1597751871/restaurants/restaurants-22_c6fkde.jpg',
                'https://res.cloudinary.com/alineconsigne/image/upload/v1597751871/restaurants/restaurants-16_kcbt3d.jpg',
                'https://res.cloudinary.com/alineconsigne/image/upload/v1597751871/restaurants/restaurants-17_tfxqit.jpg',
                'https://res.cloudinary.com/alineconsigne/image/upload/v1597751871/restaurants/restaurants-13_fiwvp1.jpg',
                'https://res.cloudinary.com/alineconsigne/image/upload/v1597751871/restaurants/restaurants-19_btgkje.jpg',
                'https://res.cloudinary.com/alineconsigne/image/upload/v1597751871/restaurants/restaurants-18_cxxkys.jpg',
                'https://res.cloudinary.com/alineconsigne/image/upload/v1597751871/restaurants/restaurants-15_k7oqt4.jpg']

restaurants.forEach((resto) => {
  if(resto.placeImg == undefined || resto.placeImg == '' || !resto.placeImg) {
    var randomNum = (Math.floor(Math.random()*18))
    resto.placeImg = images[randomNum]
    // console.log(resto.placeImg)
    resto.save()
  }
})
  
})

// add opening hours



router.get('/add-hours', async function(req, res, next) {
  var places = await PlaceModel.find() 
  places.forEach((place) => {
    if (place.openingHours == undefined || place.openingHours == '' || !place.openingHours) {
      place.openingHours = 'lundi: 12:00 – 14:30, 17:30 – 22:00,mardi: 12:00 – 14:30, 17:30 – 22:00,mercredi: 12:00 – 14:30, 17:30 – 22:00,jeudi: 12:00 – 14:30, 17:30 – 22:00,vendredi: 12:00 – 14:30, 17:30 – 22:00,samedi: 12:00 – 14:30, 17:30 – 22:00,dimanche: 12:00 – 14:30, 17:30 – 22:00'
      place.save()
    }
  })
})





module.exports = router;
