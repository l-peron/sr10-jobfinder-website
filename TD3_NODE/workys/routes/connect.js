var express = require('express');
var router = express.Router();
var userModel = require('../models/users.js');
var organizationMembersModel = require('../models/organization_members.js');

// LOGOUT
router.get('/logout', function(req, res, next) {
  req.session.destroy();

  return res.redirect('/connect');
})

// IF ALREADY CONNECTED RETURN TO /
router.use(function(req, res, next) {
  if(req.session.user)
    return res.redirect('/');

  next();
})

// UNLOGGED
router.get('/', function(req, res, next) {
  return res.render('connect')
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
        user_result = user_result[0];
        
        organizationMembersModel.getUserOrganization(user_result.id, function(org_result) {

          req.session.user = {
            user_id : user_result.id,
            user_mail : user_result.email,
            user_role : user_result.role,
            org_siren : (org_result)? org_result.organisation : null
          }

          return res.redirect('/');
        })
      })
    } else res.redirect('/connect');
  });
})

module.exports = router;
