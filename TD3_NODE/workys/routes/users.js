var express = require('express');
var userModel = require('../models/users.js');
var router = express.Router();

router.get('/userlist', function (req, res, next) { 
  result=userModel.readall(function(result) {
    res.render('userlist', { title: 'List des utilisateurs', users: result });
  });
});

router.get('/me', function (req, res, next) { 
  const accountEmail = req.session.user.user_mail;

  result=userModel.read(accountEmail, function(result) {
    res.render('user', { title: `Compte de ${accountEmail}`, user: result });
  });
});

router.get('/:email', function (req, res, next) { 
  const accountEmail = String(req.params.email);

  result=userModel.read(accountEmail, function(result) {
    res.render('user', { title: `Compte de ${accountEmail}`, user: result });
  });
});

module.exports = router;
