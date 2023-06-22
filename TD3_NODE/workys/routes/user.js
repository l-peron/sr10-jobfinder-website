var express = require('express');
var userModel = require('../models/users.js');
var candidaturesModel = require('../models/candidatures.js');
var piecesJointesModel = require('../models/pieces_jointes.js');
var organizationMembersModel = require('../models/organization_members.js');
var organizationModel = require('../models/organization.js');
var fs = require('fs');
var router = express.Router();
var multiparty = require('multiparty');
const bcrypt = require("bcrypt")

const FILE_PATH = `${__dirname}/../private/files/`

router.get('/me', function (req, res, next) { 
  const accountEmail = req.session.user.user_mail;

  result=userModel.read(accountEmail, function(err, result) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }
    
    const user = result[0] 
    res.render('user/user', { title: `Compte de ${accountEmail}`, user: user });
  });
});

// PERSONAL OR ADMIN HEADER

router.use('/:id', function(req, res, next) {
  const user_id = Number(req.params.id);

  if(!req.session.user.is_admin && req.session.user.user_id != user_id) {
    req.flash('error', "Vous n'avez pas accès a cette page")
    return res.redirect('/')
  }
  
  next();
})

router.get('/:id', function (req, res, next) { 
  const user_id = Number(req.params.id);

  result=userModel.readById(user_id, function(err, result) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    const accountEmail = result.email;
    return res.render('user/user', { title: `Compte de ${accountEmail}`, user: result });
  });
});

router.post('/:id/update', function (req, res, next) { 
  const user_id = Number(req.params.id);

  const user_update = {
    user_fname : req.body.fname,
    user_lname : req.body.lname,
    user_mail : req.body.mail,
    user_phone : req.body.phone,
  }

  const user_password = req.body.pwd;

  for (const [key, value] of Object.entries(user_update)) {
    if(!value || value === '')
      return res.status(403).send('Null or empty values');
  }

  userModel.read(req.session.user.user_mail, function(err, user_result) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    user_result = user_result[0];
    
    bcrypt.compare(user_password, user_result.password, function(err, valid) {
      if(err) {
        console.log(err);

        req.flash('error', "Une erreur est survenue... Veuillez réessayer")
        return res.redirect('back');
      }

      if(valid) {
        result=userModel.update(
          user_id, 
          user_update.user_fname, 
          user_update.user_lname, 
          user_update.user_mail, 
          user_update.user_phone,
        function(err, result) {
          if(err) {
            console.log(err);

            req.flash('error', "Une erreur est survenue... Veuillez réessayer")
            return res.redirect('back');
          }

          if(req.session.user.user_id === user_id) {
            req.flash('success', "Modification effectuées avec succès. Vous avez été deconnecté pour appliquer les changements")
            return res.redirect('/connect/logout');
          }

          req.flash('success', "Modification effectuées avec succès.")
          return res.redirect(`/user/${user_id}`)
        });
      } else {
        req.flash('error', "Les mots de passe ne correspondent pas")
        return res.redirect('back');
      }
    })
  })
});

// CANDIDATURES

router.get('/:id/candidatures/list', function (req, res, next) { 
  const user_id = Number(req.params.id);

  candidaturesModel.readByUserId(user_id, function(err, result) {
    if(err) {
      console.log(err);
      
      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    return res.render('user/candidatures/list', { title: `Candidature de X`, candidatures: result });
  })
})

router.get('/:id/candidatures/:cid', function (req, res, next) { 
  const candidature_id = Number(req.params.cid);

  candidaturesModel.readById(candidature_id, function(err, result) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    const candidature_result = result[0]

    piecesJointesModel.readByCandidatureId(candidature_id, function(err, piece_result) {
      if(err) {
        console.log(err);

        req.flash('error', "Une erreur est survenue... Veuillez réessayer")
        return res.redirect('back');
      }

      return res.render('user/candidatures/candidatures', { title: `Candidature X`, candidature: candidature_result, pieces : piece_result });
    })
  })
})

router.get('/:id/candidatures/:cid/delete', function (req, res, next) { 
  const candidature_id = Number(req.params.cid);
  const user_id = Number(req.params.id);

  candidaturesModel.delete(candidature_id, function(err, result) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    req.flash('success', "Candidature supprimée avec succès")
    res.redirect(`/user/${user_id}/candidatures/list`);
  })
})

router.post('/:id/candidatures/:cid/pieces_jointes/add', function(req, res, next) {
  const candidature_id = Number(req.params.cid);

  const form = new multiparty.Form();

  // Parse the form
  form.parse(req, function(err, fields, files) {  
    const parsedType = fields['type']
    const parsedFiles = files['file']

    if(parsedFiles.length === 0 || parsedFiles[0].size === 0) return;

    const parsedFile = parsedFiles[0];

    // Save the file
    const newFileName = saveFile(parsedFile.path, candidature_id);

    // Once saved, add the piece
    piecesJointesModel.add(candidature_id, newFileName, parsedFile.originalFilename, parsedType, () => {
      if(err) {
        console.log(err);

        req.flash('error', "Une erreur est survenue... Veuillez réessayer")
        return res.redirect('back');
      }
    })

    req.flash('success', "Pièce jointe.s ajoutée.s avec succès")
    return res.redirect('back')
  });
})

router.get('/:id/candidatures/:cid/pieces_jointes/:pjid', function(req, res, next) {
  const piece_id = Number(req.params.pjid);

  piecesJointesModel.read(piece_id, function(err, result) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }
    
    try {
      const piece_result = result[0]
      const file = `${FILE_PATH}${piece_result.filename}`;

      return res.download(file, piece_result.orginal_filename);
    } catch {
      return res.status(404).send('File not found');
    }
  })
})

router.get('/:id/candidatures/:cid/pieces_jointes/:pjid/delete', function(req, res, next) {
  const piece_id = Number(req.params.pjid);

  piecesJointesModel.delete(piece_id, function(err, result) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    req.flash("success", "Pièce jointe supprimée avec succès")
    res.redirect('back')
  })
})

router.get('/:id/requests/list', function(req, res, next) {
  const user_id = Number(req.params.id);

  organizationMembersModel.readByUserId(user_id, function(err, result) {
    if(err) {
      console.log(err);
      
      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    return res.render('user/request/list', { 
      pending_requests : result.filter(e => e.status === 'pending'),
      refused_requests : result.filter(e => e.status === 'refused')
    });
  })
})

router.get('/:id/organizations/requests/list', function(req, res, next) {
  const user_id = Number(req.params.id);

  organizationModel.readByCreatorId(user_id, function(err, result) {
    if(err) {
      console.log(err);

      req.flash('error', "Une erreur est survenue... Veuillez réessayer")
      return res.redirect('back');
    }

    return res.render('user/organization/request/list', { 
      pending_requests : result.filter(e => e.status === 'pending'),
      refused_requests : result.filter(e => e.status === 'refused')
    });
  })
})

const saveFile = (filepath, candidature_id) => {
  const extension = filepath.split('.')?.pop() || ''
  const newFileName = `${Date.now()}-${candidature_id}.${extension}`;
  const newFilePath = `${FILE_PATH}${newFileName}`

  fs.copyFileSync(filepath, newFilePath);

  return newFileName;
}

module.exports = router;
