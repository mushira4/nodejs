const KEY = 'ntalk.sid', SECRET = 'ntalk';

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
    cookie = cookieParser(SECRET),
    store = new expressSession.MemoryStore(),
    mongoose = require('mongoose');

global.db = mongoose.connect('mongodb://127.0.0.1:27017/ntalk');

// View engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookie);
app.use(expressSession({
  secret: SECRET,
  name: KEY,
  resave: true,
  saveUninitialized: true,
  store: store
}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));

//__dirname = current app directory path
app.use(express.static(__dirname + '/public'));
app.use('/bootstrap/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

io.use(function(socket, next){
  var data = socket.request;
  cookie(data, {}, function(err){
    var sessionID = data.signedCookies[KEY];
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

server.listen(3000, function(){
  console.log("Ntalk up and running.");
});

