var express = require('express');
var router = express.Router();
const PlaceModel = require('../models/placeModel');


const openingHours = [
    'Lundi: 09:30 – 12:30, 14:30 – 18:30',
    'Mardi: 09:30 – 12:30, 14:30 – 18:30',
    'Mercredi: 09:30 – 12:30, 14:30 – 18:30',
    'Jeudi: 09:30 – 12:30, 14:30 – 18:30',
    'Vendredi: 09:30 – 12:30, 14:30 – 18:30',
    'Samedi: 09:30 – 18:30',
    'Dimanche: Fermé'
    ]

/* change opening hours to array */
router.put('/change-hours', async function(req, res, next) {

    var places = await PlaceModel.updateMany({
        openingHours: openingHours
    })

    var placesSaved = await places.save()

    if (placesSaved) {
        res.sens(places)
    }
})

module.exports = router;


