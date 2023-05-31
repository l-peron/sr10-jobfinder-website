var express = require('express');
var router = express.Router();
var organizationMembersModel = require('../models/organization_members.js');

// Recrutier check 🥳
router.use('/', function(req, res, next) {
  if(req.session.user.user_role === 'utilisateur')
    return res.redirect('/');
  
  next()
})

router.get('/', function(req, res, next) {
  return res.render('recruiter', { title: 'Espace recruteur' });
});

router.get('/requests/list', function(req, res, next) {
  const org_siren = req.session.user.organization_siren;

  result = organizationMembersModel.read(org_siren, 0, function(result) {
    return res.render('recruiter/requests/list', { title : 'Liste des requêtes d\'adhésion', requests : result })
  })
})

module.exports = router;
