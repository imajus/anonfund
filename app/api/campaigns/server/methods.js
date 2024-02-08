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
      'userId': this.userId,
      'name': name,
      'description': description,
      'contact': contact,
    });
    const address = await IronFish.createAccount(campaignId);
    await Campaigns.updateAsync(campaignId, { $set: { address } });
    return campaignId;
  },
  async 'Campaigns.getViewKey'(campaignId) {
    check(this.userId, String);
    check(campaignId, String);
    const campaign = Campaigns.findOne(campaignId);
    if (!campaign) {
      throw new Meteor.Error(404, 'Campaign not found');
    }
    if (campaign.userId !== this.userId) {
      throw new Meteor.Error(403, 'You are not allowed to view this campaign');
    }
    return IronFish.getViewKey(campaignId);
  },
});
