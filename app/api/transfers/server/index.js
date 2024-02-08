import { Meteor } from 'meteor/meteor';
import { reverse } from 'lodash';
import { IronFish } from '/api/ironfish/server';
import { Transfers } from '../collection';

//TODO: Testing coverage
export async function maybeCompleteTransfer(transfer) {
  const transactions = await IronFish.getAccountTransactions(transfer.userId);
  const [incoming] = reverse(
    transactions
      .filter(({ status }) => status === 'confirmed')
      .filter(({ type }) => type === 'receive')
      .filter(({ hash }) => Transfers.find({ 'hash': hash }).count() === 0)
      .filter(({ hash, assetBalanceDeltas }) => {
        if (assetBalanceDeltas.length === 1) {
          const [{ assetId, delta }] = assetBalanceDeltas;
          return (
            assetId === Meteor.settings.IronFish.assetId &&
            delta === String(transfer.amount)
          );
        }
        // Not supported state
        console.error(
          'Skipping transaction because of multiple assets deltas',
          hash,
        );
        return false;
      }),
  );
  if (incoming) {
    const outgoing = await IronFish.sendTransaction(
      transfer.userId,
      transfer.to,
      String(transfer.amount),
    );
    // TODO: Additionally check if wasn't yet updated by another node
    await Transfers.updateAsync(transfer._id, {
      $set: {
        'incoming': incoming.hash,
        'outgoing': outgoing.hash,
        'completedAt': new Date(),
      },
    });
    console.info('Completed transfer', transfer._id, transfer.amount);
  } else {
    console.debug(
      'No incoming transaction found for transfer',
      transfer._id,
      transfer.amount,
    );
  }
}
