var express = require('express');
var router = express.Router();
var userModel = require('../models/users.js');
var organizationMembersModel = require('../models/organization_members.js');
var offresEmploiModel = require('../models/offre_emplois.js');

// For password encryption
const bcrypt = require("bcrypt")
const SALT_ROUNDS = 10

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

  offresEmploiModel.readAllWithExtendedInfos(function(result) {

    result.forEach(s => console.log(new Date() < new Date(s.valid_date)));

    const annonces = result.filter(a => { return new Date() < new Date(a.valid_date) && a.status == 'published'; }).map(a => {
      return {
        id: a.id,
        description: a.description,
        title: a.title,
        poste_status: a.poste_status,
        type: a.type,
        address: a.poste_description,
        responsable: a.responsable,
        max_salary: a.max_salary,
        min_salary: a.min_salary,
        avg_salary: a.average_salary,
        hours: a.hours,
        day_off: a.day_off,
        org_name: a.name
      }
    });

    return res.render('connect', { annonces });
  });
});

// CREATE ACCOUNT
router.post('/create', function (req, res, next) {
  const user_fname = req.body.fname;
  const user_lname = req.body.lname;
  const user_mail = req.body.mail;
  const user_pwd = req.body.pwd;
  const user_phnbr = req.body.phnbr;

  bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
    bcrypt.hash(user_pwd, salt, function(err, hash) {
      result = userModel.createAccount(user_fname, user_lname, user_mail, hash, salt, user_phnbr, function(result) {
        res.redirect('/connect');
      })
    })
  })
})

// LOGIN TO ACCOUNT
router.post('/login', function(req, res, next) {
  const user_mail = req.body.mail;
  const user_pwd = req.body.pwd;

  
  userModel.read(user_mail, function(user_result) {
    user_result = user_result[0];

    bcrypt.compare(user_pwd, user_result.password, function(err, result) {
      if (result) {

        organizationMembersModel.getUserOrganization(user_result.id, function(org_result) {

          req.session.user = {
            user_id : user_result.id,
            user_mail : user_result.email,
            user_role : user_result.role,
            org_siren : (org_result)? org_result.organisation : null
          }

          return res.redirect('/');
        })
      } else res.redirect('/connect');
      
    })
  });
});

module.exports = router;
