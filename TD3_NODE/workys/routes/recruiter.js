var express = require('express');
var router = express.Router();

// Recrutier check 🥳
router.use('/', function(req, res, next) {
  if(req.session.user.user_role === 'utilisateur')
    return res.redirect('/');
  
  next()
})

router.get('/', function(req, res, next) {
  return res.render('recruiter', { title: 'Espace recruteur' });
});

module.exports = router;
