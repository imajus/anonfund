import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';
import { IronFish } from './client';
import { Transfers } from '/api/transfers';

async function fetchNotesByViewOnlyKey(key) {
  let account;
  let temporary = true;
  try {
    account = await IronFish.importAccount(key);
  } catch (err) {
    const prefix = 'Account already exists with the name ';
    if (err.reason?.startsWith(prefix)) {
      account = err.reason.substr(prefix.length);
      temporary = false;
    } else {
      throw err;
    }
  }
  //FIXME: A workaround to bypass the case of getting empty list of transactions
  await new Promise((resolve) => {
    Meteor.setTimeout(resolve, 1000);
  });
  const notes = await IronFish.getNotes(account);
  if (temporary) {
    await IronFish.removeAccount(account);
  }
  return notes;
}

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
    const notes = await fetchNotesByViewOnlyKey(key);
    // Keep only relevant assets
    return notes
      .filter(
        ({ assetId }) => assetId === Meteor.settings.public.IronFish.assetId,
      )
      .map(({ memo, spent, sender, value }) => ({
        memo,
        spent,
        sender,
        amount: value / 10 ** 8,
      }));
  },
});
