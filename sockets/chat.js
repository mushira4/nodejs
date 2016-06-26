var config = require("../../config/config.js");

module.exports = function(io){
  var crypto = require('crypto'),
  	  redis = require('redis').createClient(config.redisPort, config.redisAddress),
      sockets = io.sockets,
      onlines = {};
  
  if(config.redisAuth){
	redis.auth(config.redisAuth);  
  }
  
  sockets.on('connection', function(client){
    var session = client.handshake.session,
        user = session.user;
    onlines[user.email] = user.email;
    for(var email in onlines){
      client.emit('notify-onlines', email);
      client.broadcast.emit('notify-onlines', email);
    }   
 
    client.on('send-server', function(msg){
      var room = session.room,
          data = {email: user.email, room: room};
      msg = "<b>" + user.name + ":</b>" + msg + "<br>";
      redis.lpush(room, msg);   
      client.broadcast.emit('new-message', data);
      sockets.in(room).emit('send-client', msg)
    });

    client.on('join', function(room){
      if(!room){
        var timestamp = new Date().toString(),
            md5 = crypto.createHash('md5');
        room = md5.update(timestamp).digest('hex');
      }
      session.room = room;
      client.join(room);

      var msg = "<b>" + user.name + ":</b> entrou.<br>";
      redis.lpush(room, msg, function(error, res){
        redis.lrange(room, 0, -1, function(error, msgs){
          msgs.forEach(function(msg){
            sockets.in(room).emit('send-client', msg);
          });
        });
      }); 
    });

    client.on('disconnect', function(){
      var room = session.room,
          msg = "<b>"+user.name+":</b> saiu.<br/>";
      redis.lpush(room, msg);
      client.broadcast.emit('notify-offlines', user.email);
      sockets.in(room).emit('send-client', msg);
      delete onlines[user.email];
      client.leave(room);
    });
  });
}
