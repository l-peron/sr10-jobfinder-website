var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require('connect-flash');

// Routers
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var connectRouter = require('./routes/connect');
var registerRouter = require('./routes/register');
var recruiterRouter = require('./routes/recruiter');
var organizationRouter = require('./routes/organization');
var adminRouter = require('./routes/admin');
var offreEmploiRouter = require('./routes/offreEmploi');

var session = require('express-session')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/"))
);
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))
app.use(flash());

// Flash messages handler
app.use(function(req, res, next){
  // On utilise "req.flash(type, msg)" pour flasher des messages
  res.locals.messages = req.flash();
  next();
});

// Not logged in
app.use('/connect', connectRouter);
app.use('/register', registerRouter);

// Now logged in + session
app.use(function(req, res, next) {
  if(!req.session.user)
    return res.redirect('/connect');

  res.locals.user = req.session.user;

  next();
});
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/recruiter', recruiterRouter);
app.use('/organization', organizationRouter);
app.use('/admin', adminRouter);
app.use('/offreemploi', offreEmploiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
