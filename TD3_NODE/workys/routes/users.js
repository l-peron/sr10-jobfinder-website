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

module.exports = router;
