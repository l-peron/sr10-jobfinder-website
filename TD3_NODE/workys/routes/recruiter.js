var express = require('express');
var router = express.Router();
var organizationMembersModel = require('../models/organization_members.js');
var offresEmploiModel = require('../models/offre_emplois.js');
var fichesPosteModel = require('../models/fiche_postes.js');
var userModel = require('../models/users.js');
var salaryModel = require('../models/salarys.js');
var workflowModel = require('../models/workflows.js');

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

router.post('/offresemploi/create', function(req, res, next) {
  const valid_date = req.body.oe_valid_date;
  const description = req.body.oe_description;
  const fiche_id = req.body.oe_fiche;
  const org_siren = req.session.user.org_siren;

  offresEmploiModel.create(valid_date, description, fiche_id, org_siren, function(results) {});
  
  return res.redirect('/recruiter/manage/create');
})

// Fiche poste

router.get('/fichesposte/list', function(req, res, next) {
  result = fichesPosteModel.readByOrganization(req.session.user.org_siren, function(fiches) {

    userModel.readAll(function(users) {

      organizationMembersModel.getOrganizationMembers(req.session.user.org_siren, function(members_id) {

        const members = users.filter(u => members_id.find(m => m.user === u.id));

        const fichesPoste = [];

        for(const fiche of fiches) {
          fichesPoste.push({
            title: fiche.title,
            status: fiche.status,
            type: fiche.type,
            address: fiche.address,
            description: fiche.description,
            responsable: users.find(u => u.id === fiche.responsable),
          });
        }
  
        return res.render('recruiter/fichesposte/list', { list_title: 'Liste des fiches de postes', create_title : 'Créer une fiche de postes' , fichesPoste, members});
      });
    });
  });
})

router.post('/fichesposte/create', function(req, res, next) {
  const title = req.body.fp_title;
  const role = req.body.fp_role;
  const resp_id = parseInt(req.body.fp_resp);
  const type = req.body.fp_work_type;
  const address = req.body.fp_address;

  const workflow = req.body.fp_workflow;
  const remote = req.body.fp_workaway !== null;
  const dayoff = req.body.fp_dayoff;

  const min_salary = req.body.fp_salary_min;
  const max_salary = req.body.fp_salary_max;
  const desc = req.body.fp_desc;

  workflowModel.createWorkflow(workflow, remote, dayoff, function(workflow) {

    salaryModel.createSalary((min_salary+max_salary)/2, min_salary, max_salary, function(salary) {
      fichesPosteModel.createFichePoste(title, role, type, address, desc, resp_id, workflow.insertId, salary.insertId, req.session.user.org_siren, function(result) {});
    });
  });

  return res.redirect('/fichesposte/list');
});

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
