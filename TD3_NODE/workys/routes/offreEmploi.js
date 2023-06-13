const { query } = require('express');
var express = require('express');
var router = express.Router();
var candidaturesModel = require('../models/candidatures.js');
var offreEmploiModel = require('../models/offre_emplois.js');
var multiparty = require('multiparty');

router.get('/:id', function(req, res, next) {
  const offer_id = Number(req.params.id);

  result = offreEmploiModel.readWithExtendedInfos(offer_id, function(result) {
    const offer = result[0];

    return res.render('offreEmploi/offreEmploi', { title : 'Titre', offre : offer })
  })
})

router.post('/:id/apply', function(req, res, next) {
  const offer_id = Number(req.params.id);
  const user_id = req.session.user.user_id;

  const form = new multiparty.Form();

  result = candidaturesModel.apply(offer_id, user_id, function(result) {
    // Retrieve the last inserted candidature
    const candidature_id = result.insertId;

    // If candidature is created, parse the form
    form.parse(req, function(err, fields, files) {  
      const parsedTypes = fields['type[]']
      const parsedFiles = files['file[]']

      // For each piece, add it
      for(let i = 0; i < parsedFiles.length; i++) {
        candidaturesModel.addPiece(candidature_id, parsedFiles[i].path, parsedTypes[i], () => {})
      }

      return res.redirect('/')
    });
  });
})

module.exports = router;
