import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Campaigns } from '../collection';
import { IronFish } from '/api/ironfish/server';
import { Transfers } from '/api/transfers';

const { fee } = Meteor.settings.public.IronFish;

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
    console.debug('Created Campaign account', campaignId, address);
    await IronFish.sendTransaction(null, address, fee);
    console.debug('Deposit fee amount to transfer account', fee);
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
    if (campaign.archivedAt) {
      throw new Meteor.Error('Campaign is already closed');
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
      Meteor.settings.public.IronFish.bridgeAddress,
      // Transaction fee is expected to be in account already
      String(amount),
      memo,
    );
    await Campaigns.updateAsync(campaign._id, {
      $set: {
        'hash': hash,
        'archivedAt': new Date(),
      },
    });
  },
});
