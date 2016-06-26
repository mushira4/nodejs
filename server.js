var config = require('../config/config.js');

// Loadig modules
var express = require('express'),
    load = require('express-load'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    methodOverride = require('method-override'),
    errors = require('./middlewares/errors'),
    app = express(), // The express application
    server = require('http').Server(app),
    io = require('socket.io')(server),
    cookie = cookieParser(config.applicationSecret),
    store = new expressSession.MemoryStore(),
    mongoose = require('mongoose');

global.db = mongoose.connect(config.mongoConnectionString);

// View engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookie);
app.use(expressSession({
  secret: config.applicationSecret,
  name: config.applicationKey,
  resave: true,
  saveUninitialized: true,
  store: store
}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.locals = {
	application:{
		socketio: config.socketio
	}
};

//__dirname = current app directory path
app.use(express.static(__dirname + '/public'));
app.use('/bootstrap/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

io.use(function(socket, next){
  var data = socket.request;
  cookie(data, {}, function(err){
    var sessionID = data.signedCookies[config.applicationKey];
    store.get(sessionID, function(err, session){
      if(err || !session){
        return next(new Error('Access Denied'));
      } else {
        socket.handshake.session = session;
        return next();
      }
    });
  });
});

load('models')
  .then('controllers')
  .then('routes')
  .into(app);

load('sockets')
  .into(io);

// Handle the error tha happened
app.use(errors.notFound);
app.use(errors.serverError);

server.listen(config.serverPort, config.serverAddress, function(){
  console.log("Ntalk up and running.");
});

