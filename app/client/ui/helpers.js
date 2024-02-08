import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from '/api/ethers/client';

Template.helpers({
  'isConnected': () => Accounts.isConnected(),
  'connectedAccounts': () => Accounts.connected.get(),
  'currentAccount': () => Accounts.current.get(),
  'shortHash'(hash, { size = 2 } = {}) {
    if (hash) {
      return `${hash.substr(0, 2 + size)}…${hash.substr(-size)}`;
    }
    return '';
  },
  'Settings': () => Meteor.settings.public,
});
