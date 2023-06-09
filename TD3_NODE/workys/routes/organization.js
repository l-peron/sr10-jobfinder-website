const { query } = require('express');
var express = require('express');
var organizationModel = require('../models/organization.js');
var organizationMembersModel = require('../models/organization_members.js');
var router = express.Router();


// LIST ORGANIZATION
router.get('/list', function(req, res, next) {
  const query_string = `%${req.query.q || ''}%`

  result = organizationModel.read(query_string, function(result) {
    return res.render('organization/list', { title : 'Liste des organisation', organizations : result, query : req.query })
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
      return res.redirect('/');
    })
  })
});

module.exports = router;
