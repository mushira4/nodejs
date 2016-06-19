module.exports = function(app){
  var authenticator = require('./../middlewares/authenticator'),
      chat = app.controllers.chat;

  app.get('/chat', authenticator, chat.index);
}
