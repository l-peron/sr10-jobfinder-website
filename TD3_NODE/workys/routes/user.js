var express = require('express');
var userModel = require('../models/users.js');
var router = express.Router();

router.get('/me', function (req, res, next) { 
  const accountEmail = req.session.user.user_mail;

  result=userModel.read(accountEmail, function(result) {
    res.render('user/user', { title: `Compte de ${accountEmail}`, user: result });
  });
});

// PERSONAL OR ADMIN

router.use(function(req, res, next) {
  if(req.session.user.user_role !== 'administrateur' && req.session.user.user_id != user_id)
    return res.redirect('/')

  next();
})

router.get('/:id', function (req, res, next) { 
  const user_id = Number(req.params.id);

  if(req.session.user.user_role !== 'administrateur' && req.session.user.user_id != user_id)
    return res.redirect('/')

  result=userModel.readById(user_id, function(result) {
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

  for (const [key, value] of Object.entries(user_update)) {
    if(!value || value === '')
      return res.status(403).send('Null or empty values');
  }

  result=userModel.update(
      user_id, 
      user_update.user_fname, 
      user_update.user_lname, 
      user_update.user_mail, 
      user_update.user_phone,
      function(result) {
        if(req.session.user.user_id === user_id) {
          return res.redirect('/connect/logout');
        }
        
        return res.redirect(`/user/${user_id}`)
      });
});

module.exports = router;
