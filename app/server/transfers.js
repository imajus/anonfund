import { SyncedCron } from 'meteor/littledata:synced-cron';
import { Transfers } from '/api/transfers';
import { maybeCompleteTransfer } from '/api/transfers/server';

SyncedCron.add({
  name: 'Process pending User transactions',
  schedule: (parser) => parser.text('every 1 minute'),
  async job() {
    const transfers = Transfers.find(
      { 'completedAt': null },
      {
        sort: { 'createdAt': 1 },
      },
    );
    //FIXME: Executed in sequence to eliminate race conditions
    for await (const transfer of transfers) {
      await maybeCompleteTransfer(transfer);
    }
  },
});

SyncedCron.config({
  collectionName: 'cron',
  collectionTTL: 60,
});

 SyncedCron.start();
