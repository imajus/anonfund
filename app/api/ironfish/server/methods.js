import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';
import { IronFish } from './client';

Meteor.methods({
  async 'IronFish.createAccount'() {
    const name = Random.id();
    return IronFish.createAccount(name);
  },
  async 'IronFish.accounts'() {
    const accounts = await IronFish.getAccounts();
    return Promise.all(
      accounts.map(async (account) => {
        const address = await IronFish.getPublicKey(account);
        const balance = await IronFish.getBalance(account);
        return { name: account, address, balance };
      }),
    );
  },
  async 'IronFish.notes'(key) {
    check(key, String);
    const { assetId } = Meteor.settings.public.IronFish;
    // Use new name to avoid conflicts
    const account = await IronFish.importAccount(key, Random.id());
    //FIXME: A workaround to bypass the case of getting empty list of transactions
    await new Promise((resolve) => {
      Meteor.setTimeout(resolve, 2000);
    });
    try {
      const notes = await IronFish.getNotes(account);
      // Keep only relevant assets
      return await Promise.all(
        notes
          .filter((note) => note.assetId === assetId)
          .map(async ({ memo, spent, owner, sender, value }) => ({
            memo,
            spent,
            owner,
            sender,
            amount: value / 10 ** 8,
          })),
      );
    } finally {
      await IronFish.removeAccount(account);
    }
  },
});
