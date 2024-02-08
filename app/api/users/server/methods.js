import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { IronFish } from '/api/ironfish/server';

Meteor.methods({
  'Users.getViewKey'() {
    check(this.userId, String);
    return IronFish.getViewKey(this.userId);
  },
});
