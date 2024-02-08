import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from '/api/ethers/client';

Template.helpers({
  'isConnected': () => Accounts.isConnected(),
  'connectedAccounts': () => Accounts.connected.get(),
  'currentAccount': () => Accounts.current.get(),
  'shortHash'(hash, { size = 4 } = {}) {
    if (hash) {
      return `${hash.substr(0, size)}…${hash.substr(-size)}`;
    }
    return '';
  },
  'formatAmount': (amount) => amount / 10 ** 8,
  'formatDate': (date) => new Date(date).toLocaleDateString(),
  'Settings': () => Meteor.settings.public,
});
