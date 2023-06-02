var express = require('express');
var router = express.Router();
var organizationMembersModel = require('../models/organization_members.js');
var userModel = require('../models/users.js');

// Recrutier check 🥳
router.use('/', function(req, res, next) {
  if(req.session.user.user_role === 'utilisateur')
    return res.redirect('/');
  
  next()
})

// Pages

router.get('/', function(req, res, next) {
  return res.render('recruiter', { title: 'Espace recruteur' });
});

// /manage

router.get('/manage', function(req, res, next) {
  // TODO...
  // real fetch
  return res.render('recruiter/manage/index', { title : 'TODO' , offresEmploi : []})
})

// Offre emploi

router.get('/manage/create', function(req, res, next) {
  // TODO...
  // real fetch
  return res.render('recruiter/manage/create', { title : 'TODO' , fichesPoste : []})
})

router.post('/manage/create/validate', function (req, res, next) {
  // TODO...
  // get fields
  return res.redirect('/recruiter/manage/create');
})

// Fiche poste

router.get('/manage/ficheposte/create', function(req, res, next) {
  // TODO...
  // real fetch
  return res.render('recruiter/manage/ficheposte/create', { title : 'TODO' })
})

router.post('/manage/ficheposte/create/validate', function(req, res, next) {
  // TODO...
  // get fields
  return res.redirect('/recruiter/manage/ficheposte/create');
})

// /requests

router.get('/requests/list', function(req, res, next) {
  const org_siren = req.session.user.org_siren;

  result = organizationMembersModel.read(org_siren, 0, function(result) {
    return res.render('recruiter/requests/list', { title : 'Liste des requêtes d\'adhésion', requests : result })
  })
})

// Actions
router.get('/requests/:id/validate', function(req, res, next) {
  const org_siren = req.session.user.org_siren;
  const user_id = Number(req.params.id);

  result = organizationMembersModel.setActive(org_siren, user_id, 1, function(result) {
    result = userModel.changeRole(user_id, "recruteur", function(result) {
      return res.redirect('/recruiter/requests/list');
    })
  })
})

router.get('/requests/:id/reject', function(req, res, next) {
  const org_siren = req.session.user.org_siren;
  const user_id = Number(req.params.id);

  result = organizationMembersModel.delete(org_siren, user_id, function(result) {
    return res.redirect('/recruiter/requests/list');
  })
})



module.exports = router;
