var express = require('express');
var router = express.Router();
var organizationModel = require('../models/organization.js');
var userModel = require('../models/users.js');
var organizationMembersModel = require('../models/organization_members.js');

// Now admin
router.use(function(req, res, next) {
  if(!req.session.user.is_admin)
    return res.redirect('/');

  res.locals.user = req.session.user;

  next();
});

router.get('/', function(req, res, next) {
  return res.render('admin/index', { title : "Page d'administration" })
})

// USERS

router.get('/user/list', function(req, res, next) {
  const query_string = `%${req.query.q || ''}%`

  userModel.read(query_string, function(err, result) {
    return res.render('admin/user/list', { title : "Liste des utilisateurs", users: result, query: req.query })
  })
})

router.get('/user/:id', function(req, res, next) {
  const user_id = Number(req.params.id);

  return res.redirect(`/user/${user_id}`);
})

router.get('/user/:id/elevate', function(req, res, next) {
  const user_id = Number(req.params.id);

  userModel.setAdmin(user_id, 1, function(err, result) {
    return res.redirect('/admin/user/list');
  })
})

router.get('/user/:id/desactivate', function(req, res, next) {
  const user_id = Number(req.params.id);

  userModel.setActive(user_id, 0, function(err, result) {
    return res.redirect('/admin/user/list');
  })
})

router.get('/user/:id/activate', function(req, res, next) {
  const user_id = Number(req.params.id);

  userModel.setActive(user_id, 1, function(err, result) {
    return res.redirect('/admin/user/list');
  })
})

// ORGANIZATIONS

router.get('/organization/requests/list', function(req, res, next) {
  const query_string = `%${req.query.q || ''}%`

  organizationModel.read(query_string, function(err, result) {
    return res.render('admin/organization/request/list', { 
      pending_organizations: result.filter(e => e.status === 'pending'), 
      refused_organizations: result.filter(e => e.status === 'refused'), 
      query : req.query
    })
  })
})

router.get('/organization/list', function(req, res, next) {
  const query_string = `%${req.query.q || ''}%`

  organizationModel.read(query_string, function(err, result) {
    return res.render('admin/organization/list', { 
      organizations: result.filter(e => e.status === 'accepted'), 
      query : req.query
    })
  })
})

router.get('/organization/:siren/accept', function(req, res, next) {
  const org_siren = String(req.params.siren);

  // Set the organization accepted
  organizationModel.setStatus(org_siren, 'accepted', function(err, result) {

    // Get the creator of the org
    organizationModel.getOrganizationCreator(org_siren, function(err, result) {
      const user_id = result[0].id;

      // Change the status to that user to active in the organization
      organizationMembersModel.setStatus(org_siren, user_id, 'accepted', function(err, result) {

        // Change the role to that user to recruiter (if not admin)
        userModel.changeRole(user_id, 'recruteur', function(err, result) {
          return res.redirect('back');
        })
      })
    })
  })
})

router.get('/organization/:siren/reject', function(req, res, next) {
  const org_siren = String(req.params.siren);

  // Set the organization refused
  organizationModel.setStatus(org_siren, 'refused', function(err, result) {

    // Get the creator of the org
    organizationModel.getOrganizationCreator(org_siren, function(err, result) {
      const user_id = result[0].id;

      // Delete its row in members
      organizationMembersModel.delete(org_siren, user_id, function(err, result) {
        return res.redirect('back');
      })
    })
  })
})

module.exports = router;
