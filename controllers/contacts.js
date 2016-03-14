module.exports = function(app){
  var contactsController = {
    index: function(req, res){
      var user = req.session.user,
          params = {user: user};
      res.render(
          'contacts/index', // The page that will return.           
          params // The parameters needed to build the page
      );
    }
  };
  return contactsController;
};
