module.exports = function(app){
  var homeController = {
    index: function(req, res){
      res.render('home/index'); // The page that should be rendered
    },
    login: function(req, res){
      var email = req.body.user.email,
          name = req.body.user.name;
      
      if(email && name){
        var user = req.body.user;
        user['contacts'] = [];
        req.session.user = user;
        res.redirect('/contacts'); // Redirect to another page 
      }else{
        res.redirect('/');
      }
    },
    logout: function(req, res){
      req.session.destroy();
      res.redirect('/');
    }
  };
  
  return homeController; // It exports the configs done.
};
