
Meteor.methods({
  addUser: function(useratts) {
    var userId = Accounts.createUser({
      email: useratts.emails[0].address,
      password: Meteor.settings.defualtPassword + useratts.profile.firstName,
      profile: {
        firstName: useratts.profile.firstName,
        lastName: useratts.profile.lastName
      }
    });
    Roles.addUserToRoles(userId, useratts.profile.roles);
    console.log(userId);
  }
});
