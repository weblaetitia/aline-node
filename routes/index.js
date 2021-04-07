var express = require('express');
var router = express.Router();
const nodemailer = require("nodemailer");
var SHA256 = require('crypto-js/sha256')
var encBase64 = require('crypto-js/enc-base64')
var uid2 = require('uid2')

if(!process.env.DB_INFO){
  require('dotenv').config()
}
const reCaptcha = process.env.RECAPTCHA_API_KEY
const emailProvider = process.env.EMAIL_PROVIDER
const myEmail = process.env.EMAIL_ADDRESS
const emailPass = process.env.EMAIL_PASSWORD

// nodemailer config
var transporter = nodemailer.createTransport({
  host: emailProvider,
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: myEmail, 
    pass: emailPass, 
  }
})

const SubscriptionModel = require('../models/subscriptionModel');
const UserModel = require('../models/userModel')

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

/* GET mobile privacy page. */
router.get('/mobile-app-privacy', function(req, res, next) {
  res.render('mobile-privacy');
});

/* GET support-app page. */
router.get('/support-app', function(req, res, next) {
  res.render('support-app');
})

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
      from: `"Application Aline" <${myEmail}>`,
      to: req.body.emailFromFront,
      subject: 'Nous sommes en contact',
      text: `Merci pour l'intéret que vous portez à l'application Aline ! Soyez patient... Aline est encore en cours de développement. Vous pouvez nous suivre sur les réseaux sociaux : https://www.facebook.com/alineconsigne, https://twitter.com/aline_consigne, https://www.instagram.com/alineconsigne`,
      html: `<h1>Merci pour l'intéret que vous portez à l'application Aline</h1>
            <p>Soyez patient... Aline est encore en cours de développement.</p>
            <p>Vous pouvez nous suivre sur les réseaux sociaux :</p>
            <ul>
              <li>Facebook : <a href="https://www.facebook.com/alineconsigne">https://www.facebook.com/alineconsigne</a></li>
              <li>Twitter : <a href="https://twitter.com/aline_consigne">https://twitter.com/aline_consigne</a></li>
              <li>Instagram : <a href="https://www.instagram.com/alineconsigne">https://www.instagram.com/alineconsigne</a></li>
            </ul>
            `
    }

    var mailTwoOptions = {
      from: `"Application Aline" <${myEmail}>`,
      to: myEmail,
      subject: 'Nouvelle inscription',
      text: `Un nouvel email à été ajouté depuis la page d'accueil : ${req.body.emailFromFront}, le ${newSubSaved.created}`,
      html: `<h1>Nouveau contact !</h1>
            <p>Un nouvel email à été ajouté depuis la page d'accueil : ${req.body.emailFromFront} </p>
            <p>Le ${newSubSaved.created}</p>
            `
    }

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        // envoyer une confirmation
        transporter.sendMail(mailTwoOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Confirm sent: ' + info.response);
          }
        })
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

router.post('/captcha', function(req, res) {
  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
  }
  // Put your secret key here.
  var secretKey = "--paste your secret key here--";
  // req.connection.remoteAddress will provide IP address of connected user.
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  // Hitting GET request to the URL, Google will respond with success or error scenario.
  request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    // Success will be true or false depending upon captcha validation.
    if(body.success !== undefined && !body.success) {
      return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
    }
    res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
  });
})

// Ask a new password page
router.get('/login/identify', function(req, res, next) {
  res.render('login/identify')
})

// receive password reset request and send an email
router.post('/login/reset', async function(req, res, next) {
  if (req.body.email === '') {
    res.render('login/identify', {alert: 'empty-field'})
  } else {
    // chercher l'email en bdd
    var email = await UserModel.findOne({
      email: req.body.email
    }) 
    if (email == null) {
      res.render('login/identify', {alert: 'email-not-exist'})
    } else {
      const mailOptions = {
        from: `"Application Aline" <${myEmail}>`,
        to: req.body.email,
        subject: 'Regénérer votre mot de passe',
        text: 'Vous recevez ce message car vous avez demander à regénérer votre mot de passe pour votre compte.\n\n' +
        'Veuillez suivre ce lien (ou copier dans votre navigateur:\n\n' +
        'https://aline.app/reset/' + email.token + '\n\n' +
        'Si vous n\'avez pas demandé de regénération de votre mot de passe, veuillez ingnorer cet email, votre mot de passe restera inchangé.\n'
      }
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          res.render('login/identify', {alert: 'alert'})
        } else {
          console.log('Email sent: ' + info.response);
          res.render('login/identify', {alert: 'success'})
        }
      })
    }
  }
})

// Display reset password page if token exist
router.get('/reset/:token', async function(req, res, next) {
  const user = await UserModel.findOne({
    token: req.params.token
  })
  if (user == null) {
    res.render('error/basic-error')
  } 
  res.render('login/reset', {token: user.token})
})

// action to reset password
router.post('/reset/update', async function(req, res, next) {
  console.log(req.body)
  if (req.body.password !== req.body.passwordconfirm) {
    res.render('login/reset', {alert: 'unmatch', token: req.body.token})
  }
  if (req.body.password === '' || req.body.passwordconfirm === '' || req.body.email === '') {
    res.render('login/reset', {alert: 'empty-field', token: req.body.token})
  }
  const user = await UserModel.findOne({
    email: req.body.email,
    token: req.body.token
  })
  if (user == null) {
    res.render('login/reset', {alert: 'alert', token: req.body.token})
  } 
  const newSalt = uid2(32)
  const newPassword = SHA256(req.body.password + newSalt).toString(encBase64)
  const newToken = uid2(32)
  user.salt = newSalt
  user.token = newToken
  user.password = newPassword
  const newUser = await user.save()
  console.log(newUser)
  if (newUser == null) {
    res.render('login/reset', {alert: 'alert', token: req.body.token})
  }
  res.render('login/reset', {alert: 'success'})
})



module.exports = router;
