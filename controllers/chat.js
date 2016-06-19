module.exports = function(app){
  var chatController = {
    index: function(req, res){
      var params = {room: req.query.room};
      res.render('chat/index', params);
    }
  }
  return chatController;
}
