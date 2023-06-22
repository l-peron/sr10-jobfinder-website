const { query } = require('express');
var express = require('express');
var organizationModel = require('../models/organization.js');
var organizationMembersModel = require('../models/organization_members.js');
var router = express.Router();


// LIST ORGANIZATION
router.get('/list', function(req, res, next) {
  const query_string = `%${req.query.q || ''}%`
  const user_id = req.session.user.user_id;

  organizationMembersModel.getUserOrganizations(user_id, function(user_orgs_result) {
    // Utilisateur n'a aucune requête acceptée 
    if(!user_orgs_result.some(e => e.status === 'accepted')) {

      // Si une est en cours, redirection requêtes en cours
      if(user_orgs_result.some(e => e.status === 'pending')) {
        
        return res.redirect(`/user/${user_id}/requests/list`)
      // Sinon, on affiche la liste des organisations
      } else {
        organizationModel.read(query_string, function(result) {
          return res.render('organization/list', { 
            title : 'Liste des organisation', 
            organizations : result.filter(e => e.status === 'accepted'), 
            query : req.query 
          })
        })
      }
    // L'utilisateur est accepté dans une entreprise
    } else {
      const user_org = user_orgs_result.filter(e => e.status === 'accepted')[0];

      organizationModel.read(user_org.organisation, function(result) {
        const organization = result[0];

        // Soit l'entreprise est accepté (on ne devrait pas accéder à cette page)
        if(organization.status === 'accepted') {
          return res.redirect('/recruiter');

        // Soit l'entreprise est en attente ou refusé (l'utilisateur est créateur)
        } else {
          return res.render('organization/pending', {organization : organization});
        }
      })
    }
  })
})

// JOIN ORGANIZATION
router.get('/:siren/apply', function(req, res, next) {
  const org_siren = String(req.params.siren);
  const user_id = req.session.user.user_id;

  result = organizationMembersModel.apply(org_siren, user_id, function(result) {
    return res.redirect('/organization/list');
  })

})

router.use('/create', function(req, res, next) {
  const user_id = req.session.user.user_id;

  organizationMembersModel.getUserOrganizations(user_id, function(user_orgs_result) {
    // Utilisateur n'a aucune requête acceptée 
    if(user_orgs_result.some(e => e.status === 'accepted')) {
      return res.redirect('/recruiter')
    } else if(user_orgs_result.some(e => e.status === 'pending')){
      return res.redirect(`/user/${user_id}/requests/list`)
    } else {
      next();
    }
  })
})

// CREATE ORGANIZATION
router.get('/create', function(req, res, next) {
  return res.render('organization/create', { title: 'Formulaire de création d\'organisation' });
});

router.post('/create/validate', function(req, res, next) {
  const org_siren = req.body.org_siren
  const org_name = req.body.org_name
  const org_type = req.body.org_type
  const org_adress = req.body.org_adress

  const user_id = req.session.user.user_id;

  organizationModel.createOrganization(org_siren, org_name, org_type, org_adress, user_id, function(result) {
    organizationMembersModel.apply(org_siren, user_id, function(result) {
      organizationMembersModel.setStatus(org_siren, user_id, 'accepted', function(result) {
        return res.redirect('/');
      })
    })
  })
});

module.exports = router;
