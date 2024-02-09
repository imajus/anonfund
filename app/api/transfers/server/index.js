import { Meteor } from 'meteor/meteor';
import { IronFish } from '/api/ironfish/server';
import { Campaigns } from '/api/campaigns';
import { Transfers } from '../collection';
import './methods';

//TODO: Testing coverage
export async function maybeCompleteTransfer(transfer) {
  const balance = await IronFish.getBalance(transfer.account);
  if (balance >= transfer.amount) {
    const amount = transfer.amount - Meteor.settings.IronFish.fee;
    const campaign = Campaigns.findOne(transfer.campaignId);
    const { hash } = await IronFish.sendTransaction(
      transfer.account,
      campaign.address,
      String(amount),
    );
    // TODO: Additionally check if wasn't yet updated by another node
    await Transfers.updateAsync(transfer._id, {
      $set: {
        'hash': hash,
        'completedAt': new Date(),
        'amount': amount,
      },
    });
    console.info('Completed transfer', transfer._id, transfer.amount);
    // Drop the account
    await IronFish.removeAccount(transfer.account);
    console.debug('Removed transfer account', transfer.account);
  } else {
    console.debug(
      'Not enought balance for transfer',
      transfer._id,
      transfer.amount,
    );
  }
}
