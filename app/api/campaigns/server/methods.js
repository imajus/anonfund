import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Campaigns } from '../collection';
import { IronFish } from '/api/ironfish/server';

Meteor.methods({
  async 'Campaigns.create'(name, description, contact) {
    check(name, String);
    check(description, String);
    check(contact, String);
    const campaignId = await Campaigns.insertAsync({
      name,
      description,
      contact,
    });
    const address = await IronFish.createAccount(campaignId);
    await Campaigns.updateAsync(campaignId, { $set: { address } });
    return campaignId;
  },
  async 'Campaigns.fund'(campaignId, amount) {
    check(this.userId, String);
    check(campaignId, String);
    check(amount, Number);
    await Meteor.users.updateAsync(this.userId, {
      $push: {
        'pending': {
          campaignId,
          amount,
          createdAt: new Date(),
        },
      },
    });
  },
});
