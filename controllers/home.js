module.exports = function(app){
  var User = app.models.user;
  var homeController = {
    index: function(req, res){
      res.render('home/index'); // The page that should be rendered
    },
    login: function(req, res){
      var query = {email: req.body.user.email};
      User.findOne(query)
          .select('name email')
          .exec(function(error, user){
            if(user){
              req.session.user = user;
              res.redirect('/contacts');
            } else {
              var user = req.body.user;
              User.create(user, function(){
                if(error){
                  res.redirect('/');
                } else {
                  req.session.user = user;
                  res.redirect('/contacts')
                }
              });
            }
          });
    },
    logout: function(req, res){
      req.session.destroy();
      res.redirect('/');
    }
  };
  
  return homeController; // It exports the configs done.
};
