/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var partials  = require('express-partials');

var app = express();

var helpers = require('./helpers')(app);

// all environments
app.set('port', process.env.PORT || 1337);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(partials());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Healthcheck for Nagios
app.get('/healthcheck', routes.healthcheck);

// Redirect root to transaction start page on GOV.UK
app.get('/', routes.epdq.middleware.findTransaction, routes.epdq.rootRedirect);

// EPDQ Transaction Routes.
app.get('/start', routes.epdq.middlewares, routes.epdq.start);
app.post('/confirm', routes.epdq.middleware.findTransaction, routes.epdq.confirm);
app.get('/confirm', function(req, res){ res.redirect('/start') });
app.get('/done', routes.epdq.middleware.findTransaction, routes.epdq.done);

module.exports = app;

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
