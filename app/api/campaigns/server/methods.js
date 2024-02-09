import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Campaigns } from '../collection';
import { IronFish } from '/api/ironfish/server';
import { Transfers } from '/api/transfers';

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
  async 'Campaigns.close'(campaignId, address) {
    check(this.userId, String);
    check(campaignId, String);
    check(address, String);
    const campaign = Campaigns.findOne(campaignId);
    if (!campaign) {
      throw new Meteor.Error(404, 'Campaign not found');
    }
    if (campaign.userId !== this.userId) {
      throw new Meteor.Error(403, 'You are not allowed to close this campaign');
    }
    //TODO: Deny if there are pending transfers
    const amount = Transfers.find({
      'campaignId': campaignId,
      'completedAt': { $ne: null },
    })
      .fetch()
      .reduce((memo, transfer) => memo + transfer.amount, 0);
    const memo = Buffer.from(address, 'hex').toString('base64');
    const { hash } = await IronFish.sendTransaction(
      campaignId,
      Meteor.settings.IronFish.bridgeAddress,
      String(amount - Meteor.settings.IronFish.fee),
      memo,
    );
    await Campaigns.updateAsync(campaign._id, {
      $set: {
        'withdraw': hash,
        'archivedAt': new Date(),
      },
    });
  },
});
