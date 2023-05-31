var express = require('express');
var router = express.Router();
var organizationModel = require('../models/organization.js');
var userModel = require('../models/users.js');
var organizationMembersModel = require('../models/organization_members.js');

// Now admin
router.use(function(req, res, next) {
  if(req.session.user.user_role != "administrateur")
    return res.redirect('/');

  res.locals.user = req.session.user;

  next();
});

router.get('/', function(req, res, next) {
  return res.render('admin/index', { title : "Page d'administration" })
})

// ORGANIZATIONS

router.get('/organization/list', function(req, res, next) {
  organizationModel.readall(function(result) {
    return res.render('admin/organization/list', { title : "Liste des organisations", organizations: result })
  })
})

router.get('/organization/:siren/enable', function(req, res, next) {
  const org_siren = String(req.params.siren);

  // Set the organization active
  organizationModel.setActive(org_siren, true, function(result) {

    // Get the creator of the org
    organizationModel.getOrganizationCreator(org_siren, function(result) {
      const user_id = result[0].id;
      const user_role = result[0].role;

      // Change the status to that user to active in the organization
      organizationMembersModel.setActive(org_siren, user_id, 1, function(result) {

        // Change the role to that user to recruiter (if not admin)
        if(user_role != 'administrateur') {
          userModel.changeRole(user_id, 'recruteur', function(result) {
            return res.redirect('/admin/organization/list');
          })
        } else {
          return res.redirect('/admin/organization/list');
        }
      })
    })
  })
})

module.exports = router;
