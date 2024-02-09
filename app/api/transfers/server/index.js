import { Meteor } from 'meteor/meteor';
import { IronFish } from '/api/ironfish/server';
import { Transfers } from '../collection';

//TODO: Testing coverage
export async function maybeCompleteTransfer(transfer) {
  const balance = await IronFish.getBalance(transfer.userId);
  if (balance >= transfer.amount) {
    const amount = transfer.amount - Meteor.settings.IronFish.fee;
    const { hash } = await IronFish.sendTransaction(
      transfer.userId,
      transfer.to,
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
  } else {
    console.debug(
      'Not enought balance for transfer',
      transfer._id,
      transfer.amount,
    );
  }
}
