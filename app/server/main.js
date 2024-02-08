import { Meteor } from 'meteor/meteor';
import '/init';
import './polyfills';
import './api';
import './users';
import './transfers';
import { IronFish } from '/api/ironfish/server';

Meteor.startup(async () => {
  try {
    const { node } = await IronFish.nodeStatus();
    console.log('IronFish Node status:', node.status);
    console.log('IronFish Node version:', node.version);
    console.log('IronFish Node Network ID:', node.networkId);
  } catch (e) {
    console.error('Can not connect to IronFish node:', e.message);
  }
});
