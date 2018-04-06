'use strict';
const  http = require('http');
const express = require('express');
const cors = require('cors')
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

const config = require('./config')
const index = require('./routes/index');
const userinfo = require('./routes/userinfo');
const site = require('./routes/site');
const oauth2 = require('./oauth/oauth2');

const app = express();
// view engine config
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use express session, OAuth2orize dependency
app.use(session({
  secret: config.sessionSecret,
  cookie: { maxAge: config.maxAge },
  saveUninitialized: false,
  resave: false,
  key: 'authorization.sid'
}));

// initialize passport and its configuration
app.use(passport.initialize());
app.use(passport.session());
// Passport configuration
require('./routes/auth');

// Uniq favicon

app.use(favicon(path.join(__dirname, 'public', '/favicon.ico')));

app.use('/public', express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Populate the DB with new data
if (config.seedMongoDB) { require('./oauth/seedDB'); }

app.use('/', index);
app.get('/login', site.loginForm);
app.post('/login', site.login);
app.get('/logout', site.logout);

app.get('/oauth/authorize', oauth2.authorization);
app.post('/oauth/authorize/decision', oauth2.decision);
app.post('/oauth/token', oauth2.token);

app.get('/api/userinfo', userinfo.userinfo);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler with no stacktrace
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message//,
    // error: err
  });
});

var server = http.createServer(app);
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

setImmediate(() => {

  var addr = server.address();

  server.listen(port, addr, () => {
    console.log('OAuth2 server listening %d', port)
  })
})

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

module.exports = app;