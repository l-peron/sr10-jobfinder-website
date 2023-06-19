var express = require('express');
var router = express.Router();
var offresEmploiModel = require('../models/offre_emplois.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  const query_string = `%${req.query.q || ''}%`
  
  offresEmploiModel.getMinMaxIncomes(function(income_result) {
    const income = income_result[0];

    res.render('index', { user: req.session.user, query : req.query, income : {min: income.min, max: income.max } });
  });
});

module.exports = router;
