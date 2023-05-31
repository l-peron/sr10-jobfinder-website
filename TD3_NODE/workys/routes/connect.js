var express = require('express');
var router = express.Router();
var userModel = require('../models/users.js');

// UNLOGGED
router.get('/', function(req, res, next) {
  res.render('connect')
});

// CREATE ACCOUNT
router.post('/create', function (req, res, next) {
  const user_fname = req.body.fname;
  const user_lname = req.body.lname;
  const user_mail = req.body.mail;
  const user_pwd = req.body.pwd;
  const user_phnbr = req.body.phnbr;

  result = userModel.createAccount(user_fname, user_lname, user_mail, user_pwd, user_phnbr, function(result) {
    res.redirect('/connect');
  })
})

// LOGIN TO ACCOUNT
router.post('/login', function(req, res, next) {
  const user_mail = req.body.mail;
  const user_pwd = req.body.pwd;

  result = userModel.areValid(user_mail, user_pwd, function(result) {
    if(result) {
      userModel.read(user_mail, function(user_result) {

        req.session.user = {
          user_id : user_result.id,
          user_mail : user_result.email,
          user_role : user_result.role
        }

        res.redirect('/');
      })
    } else res.redirect('/connect');
  });
})

module.exports = router;
