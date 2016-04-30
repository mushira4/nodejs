// Loadig modules
var express = require('express'),
    load = require('express-load'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    methodOverride = require('method-override'),
    errors = require('./middlewares/errors'),
    app = express(); // The express application

// View engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser('ntalk'));
app.use(expressSession());
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));

//__dirname = current app directory path
app.use(express.static(__dirname + '/public'));
app.use('/bootstrap/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

load('models')
  .then('controllers')
  .then('routes')
  .into(app);

// Handle the error tha happened
app.use(errors.notFound);
app.use(errors.serverError);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

app.listen(3000, function(){
  console.log("Ntalk up and running.");
});
