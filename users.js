Users = Meteor.users;

UserProfileSchema = new SimpleSchema({
  firstName: {
    type: String,
    optional: true
  },
  lastName: {
    type: String,
    optional: true
  },
  roles: {
    type: String,
    optional: true,
    autoform: {
      options: [
        {label: "admin", value: 'admin'},
        {label: "user", value: 'employee'}
      ]
    }
  }
});

UserSchema = new SimpleSchema({
  username: {
    type: String,
    optional: false
  },
  emails: {
    type: [Object],
    // this must be optional if you also use other login services like facebook,
    // but if you use only accounts-password, then it can be required
    optional: false
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        this.unset();
      }
    },
    autoform: {
      type: "hidden",
      label: false
    }
  },
  profile: {
    type: UserProfileSchema,
    optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
    autoform: {
      type: "hidden",
      label: false
    }
  }
});

Users.attachSchema(UserSchema);

Users.allow({
  insert: function(userId, doc) {
    return false;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return !_.contains(fieldNames, 'roles') && userId && doc && userId === doc.userId;
  },
  remove: function(userId, doc) {
    return false; //Roles.userIsInRole(userId, ['admin'])
  },
  fetch: ['userId']
});