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
const PAGE_SIZE = process.env.PAGE_SIZE;

router.get('/', function(req, res, next) {
  const query_string = `%${(JSON.parse(req.query.query) || '')}%`
  const query_page = Number(JSON.parse(req.query.page)) || 0
  const user_id = req.session.user.user_id;

  const filters = JSON.parse(req.query.filters);

  offreEmploiModel.searchAllWithExtendedInfos(query_string, function(result) {
    candidaturesModel.readByUserId(user_id, function(candidatures_result) {
      const annonces = result
      .filter(a => { return new Date() < new Date(a.valid_date) && a.status == 'published'; })
      // Filtre sur les types
      .filter(a => { return filters.types.length === 0 || filters.types.includes(a.type)})
      // Filtre sur les localisations
      .filter(a => { return filters.localisations.length === 0 || 
        filters.localisations.some(e => new RegExp(`.*${e.toLowerCase().trim()}.*`).test(a.address.toLowerCase().trim()))})
      // Filtre sur les mots clés
      // => N'importe quel champ contient la valeur
      .filter(a => { return filters.keywords.length === 0 || 
        filters.keywords.some(e => 
          Object.entries(a).some((item) => {
            // item[1] is value
            // JSON stringify to insure it's a string
            return new RegExp(`.*${e.toLowerCase().trim()}.*`).test(JSON.stringify(item[1]).replaceAll("\"", "").toLowerCase().trim())
          })
        )
      })
      // Filtre sur le prix min
      .filter(a => { return filters.min_price === undefined || filters.min_price <= a.min_salary })
      // Filtre sur le prix max
      .filter(a => { return filters.max_price === undefined || filters.max_price >= a.max_salary })
      .map(a => {
        return {
          id: a.id,
          description: a.description,
          title: a.title,
          poste_status: a.poste_status,
          type: a.type,
          address: a.address,
          responsable: a.responsable,
          max_salary: a.max_salary,
          min_salary: a.min_salary,
          avg_salary: a.average_salary,
          hours: a.hours,
          day_off: a.day_off,
          org_name: a.name,
          // Check if user has already applied
          has_applied: candidatures_result.some(e => e.offer_id === a.id)
        }
      })

      return res.json({ result : { 
        annonces : annonces.slice(query_page * PAGE_SIZE, (query_page + 1) * PAGE_SIZE) ,
        has_before : query_page > 0,
        has_after : ((query_page + 1) * PAGE_SIZE) < annonces.length
      }})
    })
  });
})

router.get('/:id', function(req, res, next) {
  const offer_id = Number(req.params.id);
  const user_id = req.session.user.user_id;

  result = offreEmploiModel.readWithExtendedInfos(offer_id, function(result) {
    candidaturesModel.readByUserId(user_id, function(candidatures_result) {
      const offer = {...result[0], has_applied : candidatures_result.some(e => e.offer_id === result[0].id)};

      organizationModel.read(offer.siren, function(organisation) {

        organisation = organisation[0];

        offreEmploiModel.readAllWithExtendedInfos(function(offres) {

          return res.render('offreEmploi/offreEmploi', { title : 'Titre', offre : { ...offer, organisation}, others: offres.filter(o => o.siren === organisation.siren) });

        });
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
