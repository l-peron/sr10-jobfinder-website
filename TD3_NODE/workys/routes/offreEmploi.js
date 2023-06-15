const { query } = require('express');
var express = require('express');
var router = express.Router();
var fs = require('fs');
var candidaturesModel = require('../models/candidatures.js');
var offreEmploiModel = require('../models/offre_emplois.js');
var piecesJointesModel = require('../models/pieces_jointes.js');
var organizationModel = require('../models/organization.js');
var multiparty = require('multiparty');

const FILE_PATH = `${__dirname}/../private/files/`

router.get('/:id', function(req, res, next) {
  const offer_id = Number(req.params.id);

  result = offreEmploiModel.readWithExtendedInfos(offer_id, function(result) {
    const offer = result[0];

    organizationModel.read(offer.siren, function(organisation) {

      organisation = organisation[0];

      offreEmploiModel.readAllWithExtendedInfos(function(offres) {

        return res.render('offreEmploi/offreEmploi', { title : 'Titre', offre : { ...offer, organisation}, others: offres.filter(o => o.siren === organisation.siren) });

      });
    });
  });
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

      if(!parsedFiles || parsedFiles.lenth === 0) return res.redirect('back')

      // For each piece, add it
      for(let i = 0; i < parsedFiles.length; i++) {
        // Skip empty files
        if(parsedFiles[i].size === 0) continue;

        // Save the file
        const newFileName = saveFile(parsedFiles[i].path, candidature_id);

        // Once saved, add the piece
        piecesJointesModel.add(candidature_id, newFileName, parsedFiles[i].originalFilename, parsedTypes[i], () => {})
      }

      return res.redirect('back')
    });
  });
})

const saveFile = (filepath, candidature_id) => {
  const extension = filepath.split('.')?.pop() || ''
  const newFileName = `${Date.now()}-${candidature_id}.${extension}`;
  const newFilePath = `${FILE_PATH}${newFileName}`

  fs.copyFileSync(filepath, newFilePath);

  return newFileName;
}

module.exports = router;
