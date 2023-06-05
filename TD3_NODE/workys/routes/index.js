var express = require('express');
var router = express.Router();
var offresEmploiModel = require('../models/offre_emplois.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  /*
  if(!req.session.user_mail)
    return res.redirect('/connect');
  */

  const query_string = `%${req.query.q || ''}%`
  
  offresEmploiModel.readAllWithExtendedInfos(function(result) {

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

    console.log(annonces);
    res.render('index', { user: req.session.user, annonces });
  });
});

module.exports = router;
