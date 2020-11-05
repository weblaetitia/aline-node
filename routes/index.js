var express = require('express');
var router = express.Router();
const nodemailer = require("nodemailer");

if(!process.env.DB_INFO){
  require('dotenv').config()
}
const gmailPassword = process.env.GMAIL_PASSWORD

// nodemailer config
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aline.consigne@gmail.com',
    pass: gmailPassword
  }
})



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
    res.render('index', { subscription: 'empty' })
  } else {
  // verifier si l'email existe
  var email = await SubscriptionModel.findOne({
    email: req.body.emailFromFront
  }) 

  if (email) {
    res.render('index', { subscription: 'exist' })
  } else {

    // enregistrer l'email en bdd
    var date = new Date()
    var newSub = await SubscriptionModel( {
      created: date,
      email: req.body.emailFromFront
    })
    var newSubSaved = await newSub.save()

    // envoyer un email
    var mailOptions = {
      from: '"Application Aline" <aline.consigne@gmail.com>',
      to: req.body.emailFromFront,
      subject: 'Nous sommes en contact',
      text: `Merci pour l'intéret que vous portez à l'application Aline ! Soyez patient... Aline est encore en cours de développement. Vous pouvez nous suivre sur les réseaux sociaux : https://www.facebook.com/alineconsigne, https://twitter.com/aline_consigne, https://www.instagram.com/alineconsigne`,
      html: `<h1>Merci pour l'intéret que vous portez à l'application Aline</h1>
            <p>Soyez patient... Aline est encore en cours de développement.</p>
            <p>Vous pouvez nous suivre sur les réseaux sociaux :</p>
            <ul>
              <li>Facebook : <a href="https://www.facebook.com/alineconsigne">https://www.facebook.com/alineconsigne</a></li>
              <li>Twitter :  <a href="https://twitter.com/aline_consigne">https://twitter.com/aline_consigne</a></li>
              <li>Instagram :  <a href="https://www.instagram.com/alineconsigne">https://www.instagram.com/alineconsigne</a></li>
            </ul>
            `
    }
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    })


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
