import { Meteor } from 'meteor/meteor';
import Future from 'fibers/future';
import { Accounts } from 'meteor/accounts-base';
import { IronFish } from '/api/ironfish/server';

async function createIronFishAccount(user) {
  // eslint-disable-next-line no-param-reassign
  user.address = await IronFish.createAccount(user._id);
  return user;
}

Accounts.onCreateUser(async function (options, user) {
  return Future.fromPromise(createIronFishAccount(user)).wait();
});

Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.users.find(this.userId, { fields: { 'address': 1 } });
  }
  return [];
});
