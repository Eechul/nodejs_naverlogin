var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var NaverStrategy = require('passport-naver').Strategy;

var client_id = 'EXp9rp0smursXUmfPqn_';
var client_secret = 'KEM7FInuUp';
var callback_url = 'http://127.0.0.1:3000/welcome';

var app = express();
app.use(session({
  secret: '123215415@@DSAGnklndklsa',
  resave: false,
  saveUninitialized: true
}));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use(new NaverStrategy({
    clientID: client_id,
    clientSecret: client_secret,
    callbackURL: callback_url
}, function(accessToken, refreshToken, profile, done) {
	process.nextTick(function () {
		//console.log("profile=");
		//console.log(profile);
		// data to be saved in DB
		user = {
			name: profile.displayName,
			email: profile.emails[0].value,
			username: profile.displayName,
			provider: 'naver',
			naver: profile._json
		};
    user.save(function (err) {
      if(err) console.log(err);
      return done(err, user);
    });
	});
}));





app.use(passport.initialize());
app.use(passport.session());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res, next) {
  console.log(req.user);
  res.render('index', { user: req.user });
});

app.get('/welcome', function(req, res, next) {
  res.send('<h2>fall</h2>');
});

app.get('/login', function(req, res){
  console.log(req.user);
	res.render('login', { user: req.user });
});
app.get('/auth/naver',
	passport.authenticate('naver', null), function(req, res) {
    	console.log('/auth/naver failed, stopped');
    });
app.get('/auth/naver/callback',
	passport.authenticate('naver', {
        failureRedirect: '/welcome'
    }), function(req, res) {
    	res.redirect('/');
    });
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handlers
//
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


module.exports = app;
