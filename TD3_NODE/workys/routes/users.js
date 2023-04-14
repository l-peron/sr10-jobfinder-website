var express = require('express');
var userModel = require('../models/users.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('oui tkt');
});

router.post('/inscription', function(req, res, next) {
  res
});

router.get('/userlist', function (req, res, next) { 
  result=userModel.readall(function(result) {
    res.render('userlist', { title: 'List des utilisateurs', users: result });
  });
});

router.get('/:email', function (req, res, next) { 
  const accountEmail = String(req.params.email);

  result=userModel.read(accountEmail, function(result) {
    res.render('user', { title: `Compte de ${accountEmail}`, user: result });
  });
});

module.exports = router;
