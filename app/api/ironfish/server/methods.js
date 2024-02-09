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
  async 'IronFish.transactions'(key) {
    check(key, String);
    const account = await IronFish.importAccount(key);
    try {
      const transactions = await IronFish.getAccountTransactions(account);
      return transactions;
    } finally {
      await IronFish.removeAccount(account);
    }
  },
});
