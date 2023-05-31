var express = require('express');
var router = express.Router();
var fichePosteModel = require('../models/fiche_postes.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  /*
  if(!req.session.user_mail)
    return res.redirect('/connect');
  */

  const query_string = `%${req.query.q || ''}%`
  
  fichePosteModel.readall(function(result) {
    res.render('index', { user: req.session.user, annonces: result });
  });
});

module.exports = router;
