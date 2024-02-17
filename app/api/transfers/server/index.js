/* eslint-disable operator-linebreak */
import { Meteor } from 'meteor/meteor';
import { IronFish } from '/api/ironfish/server';
import { Campaigns } from '/api/campaigns';
import { Transfers } from '../collection';
import './methods';

//TODO: Testing coverage
export async function maybeCompleteTransfer(transfer) {
  const balance = await IronFish.getBalance(transfer.account);
  if (balance >= transfer.amount) {
    const notes = await IronFish.getNotes(transfer.account);
    for await (const note of notes) {
      if (
        note.assetId === Meteor.settings.public.IronFish.assetId &&
        note.value === String(transfer.amount)
      ) {
        const campaign = Campaigns.findOne(transfer.campaignId);
        const { hash } = await IronFish.sendTransaction(
          transfer.account,
          campaign.address,
          // Transaction fee is expected to be in account already
          String(transfer.amount),
          // Pass through memo to keep track of the transfer
          note.memo,
        );
        // TODO: Additionally check if wasn't yet updated by another node
        await Transfers.updateAsync(transfer._id, {
          $set: {
            'hash': hash,
            'completedAt': new Date(),
          },
        });
        console.info('Completed transfer', transfer._id, transfer.amount);
        // Drop the transfer account
        await IronFish.removeAccount(transfer.account);
        console.debug('Removed transfer account', transfer.account);
      } else {
        console.warn('Skipping note', note);
      }
    }
  }
}
