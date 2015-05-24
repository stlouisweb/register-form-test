if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

if (Meteor.isServer){
  Meteor.methods({
    "userExists": function(username){
      return !!Meteor.users.findOne({username: username});
    },
  });
}

var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
    _id: "username",
    type: "text",
    displayName: "username",
    required: true,
    func: function(value){
      if (Meteor.isClient) {
        console.log("Validating username...");
        var self = this;
        Meteor.call("userExists", value, function(err, userExists){
          if (!userExists)
            self.setSuccess();
          else
            self.setError(userExists);
          self.setValidating(false);
        });
        return;
      }
      // Server
      return Meteor.call("userExists", value);
    },
    minLength: 5,
  },
  {
    _id: 'email',
    type: 'email',
    required: true,
    displayName: "email",
    re: /.+@(.+){2,}\.(.+){2,}/,
    errStr: 'Invalid email',
  },
  pwd
]);

//AccountsTemplates.addField({
//  _id: 'username',
//  type: 'text',
//  required: true,
//  func: function(value){
//    if (Meteor.isClient) {
//      console.log("Validating username...");
//      var self = this;
//      Meteor.call("userExists", value, function(err, userExists){
//        if (!userExists)
//          self.setSuccess();
//        else
//          self.setError(userExists);
//        self.setValidating(false);
//      });
//      return;
//    }
//    // Server
//    return Meteor.call("userExists", value);
//  },
//});

//AutoForm.hooks({
//  insertUserForm: {
//    onSuccess: function(){
//      toastr.success('User added');
//    },
//    onError: function(){
//      toastr.error('Error adding user');
//    }
//  }
//});