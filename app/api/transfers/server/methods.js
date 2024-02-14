import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { check } from 'meteor/check';
import { Campaigns } from '/api/campaigns';
import { IronFish } from '/api/ironfish/server';
import { Transfers } from '../collection';

Meteor.methods({
  async 'Transfers.create'(campaignId, amount, origin) {
    check(this.userId, String);
    check(campaignId, String);
    check(amount, Number);
    check(origin, String);
    const campaign = Campaigns.findOne(campaignId);
    if (!campaign) {
      throw new Meteor.Error('Campaign not found');
    }
    if (campaign.archivedAt) {
      throw new Meteor.Error('Campaign is closed');
    }
    const account = Random.id();
    const address = await IronFish.createAccount(account);
    console.debug('Created transfer account', account, address);
    const key = await IronFish.getViewKey(account);
    const transferId = await Transfers.insertAsync({
      'userId': this.userId,
      'campaignId': campaign._id,
      'account': account,
      'address': address,
      'key': key,
      'amount': amount,
      'origin': origin,
      'createdAt': new Date(),
    });
    return { transferId, address };
  },
});
