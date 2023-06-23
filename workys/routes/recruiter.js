var express = require('express');
var router = express.Router();
var organizationMembersModel = require('../models/organization_members.js');
var offresEmploiModel = require('../models/offre_emplois.js');
var fichesPosteModel = require('../models/fiche_postes.js');
var userModel = require('../models/users.js');
var salaryModel = require('../models/salarys.js');
var workflowModel = require('../models/workflows.js');
var candidatureModel = require('../models/candidatures.js');
const piecesJointeModel = require('../models/pieces_jointes.js');

// Recrutier check 🥳
router.use('/', function(req, res, next) {
  if(req.session.user.user_role !== 'recruteur') {
    req.flash('error', 'Vous n\'avez pas accès a cette page')
    return res.redirect('/');
  }
  
  next()
})

// Pages

router.get('/', function(req, res, next) {
  return res.render('recruiter/index', { title: 'Espace recruteur' });
});

// /manage
// Offre emploi


router.get('/offresemploi/list', function(req, res, next) {
  offresEmploiModel.read(req.session.user.org_siren, function(err,offres) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    fichesPosteModel.readByOrganization(req.session.user.org_siren, function(err, fiches) {
      if(err) {
        console.log(err);

        req.flash('error', "Une erreur est survenue... Veuillez réessayer")
        return res.redirect('back');
      }

      return res.render('recruiter/offresemploi/list', { list_title : 'Liste des offres d\'emplois', create_title: 'Créer une offre d\'emploi' , offresEmploi : offres.map(o => { return {...o, valid_date: new Date(o.valid_date).toLocaleDateString("fr") }; }  ), fichesPoste: fiches});
    });
  });
});

router.post('/offresemploi/create', function(req, res, next) {
  const valid_date = req.body.oe_valid_date;
  const fiche_id = req.body.oe_fiche;
  const org_siren = req.session.user.org_siren;
  const required_documents = req.body.oe_required_documents;

  offresEmploiModel.create(valid_date, fiche_id, org_siren, required_documents, function(err, results) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    req.flash('success', "Offre d'emploi créée avec succès")
    return res.redirect('/recruiter/offresemploi/list');
  });
});

router.get('/offresemploi/:id/published', function(req, res, next) {

  const offre_id = Number(req.params.id);

  offresEmploiModel.setPublished(offre_id, function(err, results) {
    if(err) {
      console.log(err);
      
      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    req.flash('success', "Changement d'état de l'offre d'emploi effectué avec succès")
    return res.redirect('back');
  });
});

router.get('/offresemploi/:id/drafted', function(req, res, next) {

  const offre_id = Number(req.params.id);

  offresEmploiModel.setDrafted(offre_id, function(err, results) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    req.flash('success', "Changement d'état de l'offre d'emploi effectué avec succès")
    return res.redirect('back');
  });
  
});

router.get('/offresemploi/:id/edit', function(req, res, next) {
  const offre_id = Number(req.params.id);

  offresEmploiModel.readAllWithExtendedInfos(function(err, offres) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    fichesPosteModel.readByOrganization(req.session.user.org_siren, function(err, fichesPoste) {
      if(err) {
        console.log(err);

        req.flash('error', "Une erreur est survenue... Veuillez réessayer")
        return res.redirect('back');
      }

      return res.render('recruiter/offresemploi/unique', { offre: [offres.find(o => o.id === offre_id )].map(o => { return { ...o, valid_date: new Date(o.valid_date).toISOString().split('T')[0] }})[0], fichesPoste});
    });

  })
});

router.post('/offresemploi/:id/edit', function(req, res, next) {
  const offre_id = Number(req.params.id);

  const valid_date = req.body.oe_valid_date;
  const fiche_id = req.body.oe_fiche;

  const required_documents = req.body.oe_required_documents;

  offresEmploiModel.update(offre_id, valid_date, fiche_id, required_documents, function(err, result) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    req.flash('success','Offre d\'emploi éditée avec succès')
    return res.redirect(`/recruiter/offresemploi/${offre_id}/edit`);
  }); 
});

router.get('/offresemploi/:id/delete', function(req, res, next) {
  const offre_id = Number(req.params.id);

  offresEmploiModel.delete(offre_id, function(err, result) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    req.flash('success','Offre d\'emploi supprimée avec succès')
    return res.redirect(`/recruiter/offresemploi/list`);
  });
});

// Fiche poste

router.get('/fichesposte/list', function(req, res, next) {
  result = fichesPosteModel.readByOrganization(req.session.user.org_siren, function(err, fiches) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    userModel.readAll(function(err, users) {
      if(err) {
        console.log(err);

        req.flash('error', "Une erreur est survenue... Veuillez réessayer")
        return res.redirect('back');
      }

      organizationMembersModel.getOrganizationMembers(req.session.user.org_siren, function(err, members_id) {
        if(err) {
          console.log(err);

          req.flash('error', "Une erreur est survenue... Veuillez réessayer")
          return res.redirect('back');
        }

        const members = users.filter(u => members_id.find(m => m.user === u.id));

        const fichesPoste = [];

        for(const fiche of fiches) {
          fichesPoste.push({
            id: fiche.id,
            title: fiche.title,
            status: fiche.status,
            type: fiche.type,
            address: fiche.address,
            description: fiche.description,
            responsable: users.find(u => u.id === fiche.responsable),
          });
        }
  
        return res.render('recruiter/fichesposte/list', { list_title: 'Liste des fiches de postes', create_title : 'Créer une fiche de poste' , fichesPoste, members});
      });
    });
  });
});

router.get('/fichesposte/:id/edit', function(req, res, next) {
  const fiche_id = Number(req.params.id);

  userModel.readAll(function(err, users) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    organizationMembersModel.getOrganizationMembers(req.session.user.org_siren, function(err, members_id) {
      if(err) {
        console.log(err);

        req.flash('error', "Une erreur est survenue... Veuillez réessayer")
        return res.redirect('back');
      }

      const members = users.filter(u => members_id.find(m => m.user === u.id));

      fichesPosteModel.readById(fiche_id, function(err, fiche) {
        if(err) {
          console.log(err);

          req.flash('error', "Une erreur est survenue... Veuillez réessayer")
          return res.redirect('back');
        }

        fiche = fiche[0];

        workflowModel.read(fiche.workflow, function(err, workflow) {
          if(err) {
            console.log(err);

            req.flash('error', "Une erreur est survenue... Veuillez réessayer")
            return res.redirect('back');
          }

          salaryModel.read(fiche.salary, function(err, salary) {
            if(err) {
              console.log(err);

              req.flash('error', "Une erreur est survenue... Veuillez réessayer")
              return res.redirect('back');
            }

            cleaned_fiche = {
              id: fiche.id,
              title: fiche.title,
              status: fiche.status,
              type: fiche.type,
              address: fiche.address,
              description: fiche.description,
              responsable: users.find(u => u.id === fiche.responsable),
              workflow: workflow[0],
              salary: salary[0]
            }

            return res.render('recruiter/fichesposte/unique', { fiche: cleaned_fiche, members});

          });
        });
      });
    });
  });
});

router.post('/fichesposte/:id/edit', function(req, res, next) {

  const fiche_id = Number(req.params.id);

  const title = req.body.fp_title;
  const role = req.body.fp_role;
  const resp_id = parseInt(req.body.fp_resp);
  const type = req.body.fp_work_type;
  const address = req.body.fp_address;

  const wf_id = parseInt(req.body.fp_workflow_id);
  const workflow = req.body.fp_workflow;
  const remote = req.body.fp_workaway !== null;
  const dayoff = req.body.fp_dayoff;

  const salary_id = parseInt(req.body.fp_salary_id);
  const min_salary = req.body.fp_salary_min;
  const max_salary = req.body.fp_salary_max;
  const desc = req.body.fp_desc;

  workflowModel.modifyWorkflow(wf_id,workflow, remote, dayoff, function(err, workflow) {
    if(err) {
      console.log(err);
      
      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    salaryModel.modifySalary(salary_id,(min_salary+max_salary)/2, min_salary, max_salary, function(err, salary) {
      if(err) {
        console.log(err);

        req.flash('error', "Une erreur est survenue... Veuillez réessayer")
        return res.redirect('back');
      }

      fichesPosteModel.updateFichePoste(fiche_id, title, role, type, address, desc, resp_id, function(err, result) {
        if(err) {
          console.log(err);

          req.flash('error', "Une erreur est survenue... Veuillez réessayer")
          return res.redirect('back');
        }

        req.flash('success', 'Fiche de poste éditée avec succès')
        return res.redirect(`/recruiter/fichesposte/${fiche_id}/edit`);
      });
    });
  });
});

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

  workflowModel.createWorkflow(workflow, remote, dayoff, function(err, workflow) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    salaryModel.createSalary((min_salary+max_salary)/2, min_salary, max_salary, function(err, salary) {
      if(err) {
        console.log(err);

        req.flash('error', "Une erreur est survenue... Veuillez réessayer")
        return res.redirect('back');
      }

      fichesPosteModel.createFichePoste(title, role, type, address, desc, resp_id, workflow.insertId, salary.insertId, req.session.user.org_siren, function(err, result) {
        if(err) {
          console.log(err);
          
          req.flash('error', "Une erreur est survenue... Veuillez réessayer")
          return res.redirect('back');
        }

        req.flash('success', "Fiche de poste créée avec succès")
        return res.redirect('/recruiter/fichesposte/list');
      });
    });
  });
});

// /candidatures

router.get('/candidatures/list', function(req, res, next) {
  result = candidatureModel.readByOrganizationSiren(req.session.user.org_siren, function(err, candidatures) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    candidatures = candidatures.map(c => { return { ...c, candid_date: new Date(c.candid_date).toISOString().split('T') }});
    return res.render('recruiter/candidatures/list', { list_title: 'Liste des candidatures', candidatures });
  });
});

router.get('/candidatures/:id', function(req, res, next) {

  const id = parseInt(req.params.id);

  result = candidatureModel.readyByIdWithExtendedInfos(id, function(err, candidature) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    result = piecesJointeModel.readByCandidatureId(id, function(err, pieces) {
      if(err) {
        console.log(err);

        req.flash('error', "Une erreur est survenue... Veuillez réessayer")
        return res.redirect('back');
      }

      return res.render('recruiter/candidatures/unique', { candidature: candidature[0], pieces});
    });
  });
});

// /requests

router.get('/requests/list', function(req, res, next) {
  const org_siren = req.session.user.org_siren;

  result = organizationMembersModel.read(org_siren, function(err, result) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    return res.render('recruiter/requests/list', 
    { 
      title : 'Liste des requêtes d\'adhésion', 
      pending_requests : result.filter(e => e.status === 'pending'),
      refused_requests : result.filter(e => e.status === 'refused')
    })
  })
})

// Actions
router.get('/requests/:id/accept', function(req, res, next) {
  const org_siren = req.session.user.org_siren;
  const user_id = Number(req.params.id);

  result = organizationMembersModel.setStatus(org_siren, user_id, 'accepted', function(err, result) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    result = userModel.changeRole(user_id, "recruteur", function(err, result) {
      if(err) {
        console.log(err);

        req.flash('error', "Une erreur est survenue... Veuillez réessayer")
        return res.redirect('back');
      }

      req.flash('success', 'Demande d\'adhésion à l\'organisation accepté avec succès')
      return res.redirect('back');
    })
  })
})

router.get('/requests/:id/reject', function(req, res, next) {
  const org_siren = req.session.user.org_siren;
  const user_id = Number(req.params.id);

  result = organizationMembersModel.setStatus(org_siren, user_id, 'refused', function(err, result) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    req.flash('success', 'Demande d\'adhésion à l\'organisation accepté avec succès')
    return res.redirect('back');
  })
})



module.exports = router;
