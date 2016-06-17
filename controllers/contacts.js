module.exports = function(app){
  var User = app.models.user;
  var contactsController = {
    index: function(req, res){
      var _id = req.session.user._id;
      User.findById(_id, function(error, user){
        var contacts = user.contacts;
        var result = { 
                       user : user,
                       contacts : contacts
                     };
        res.render(
          'contacts/index', // The page that will return.
          result // The parameters needed to build the page
        );
      });
    },

    create: function(req, res){
      var _id = req.session.user._id;
      User.findById(_id, function(error, user){
        var contact = req.body.contact;
        var userContacts = user.contacts;
        userContacts.push(contact);
        user.save(function(){
          res.redirect('/contacts');
        });
      });
    },

    show: function(req, res){
      var _id = req.session.user._id;
      User.findById(_id, function(error, user){
        var contactId = req.params.id;
        var contact = user.contacts.id(contactId);
        var result = { contact : contact };
        res.render('contacts/edit', result);
      });
    },

    edit: function(req, res){
      var _id = req.session.user._id;
      User.findById(id, function(error, user){
        var contactId = req.params._id;
        var contact = user.contacts.id(contactId);
        var result = { contact : contact };
        res.render('contacts/edit', result);
      });
    },

    update: function(req, res){
      var _id = req.session.user.id;
      User.findById(_id, function(error, user){
         var contactId = req.params.id;
         var contact = user.contacts.id(contactId);
         contact.name = req.body.contact.name;
         contact.email = req.body.contact.email;
         user.save(function(){
           req.redirect('/contacts');
         });
      });
    },

    destroy: function(req, res){
      var _id = req.session.user._id;
      User.findById(_id, function(error, user){
        var contactId = req.params.id;
        user.contacts.id(contactId).remove();
        user.save(function(){
          res.redirect('/contacts');
        })
      });
    }
  };
  return contactsController;
};
