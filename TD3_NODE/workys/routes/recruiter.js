var express = require('express');
var router = express.Router();
var organizationMembersModel = require('../models/organization_members.js');
var offresEmploiModel = require('../models/offre_emplois.js');
var fichesPosteModel = require('../models/fiche_postes.js');
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

router.get('/offresemploi/list', function(req, res, next) {
  offresEmploiModel.read(req.session.user.org_siren, function(offres) {
    fichesPosteModel.readByOrganization(req.session.user.org_siren, function(fiches) {
      return res.render('recruiter/offresemploi/list', { list_title : 'Liste des offres d\'emplois', create_title: 'Créer une offre d\'emploi' , offresEmploi : offres, fichesPoste: fiches});
    });
  });
});

// Offre emploi

router.get('/offresemploi/create', function(req, res, next) {
    // TODO...
  // get fields
  return res.redirect('/recruiter/manage/create');
})

// Fiche poste

router.get('/fichesposte/list', function(req, res, next) {
  result = fichesPosteModel.readByOrganization(req.session.user.org_siren, function(fiches) {

    userModel.readAll(function(users) {
      const parsed_fiches = [];

      for(const fiche of fiches) {
        parsed_fiches.push({
          title: fiche.title,
          status: fiche.status,
          type: fiche.type,
          address: fiche.address,
          description: fiche.description,
          responsable: users.find(u => u.id === fiche.responsable),
        });
      }
      return res.render('recruiter/fichesposte/list', { list_title: 'Liste des fiches de postes', create_title : 'Créer une fiche de postes' , fichesPoste : parsed_fiches});
    });
  });
})

router.post('/fichesposte/create', function(req, res, next) {
  // TODO...
  // get fields
  return res.redirect('/recruiter/ficheposte/create');
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
