import '/init';
import './polyfills';
import './api';
import { IronFishRpcClient } from '/api/ironfish/server/client';

Meteor.startup(async () => {
  const client = new IronFishRpcClient(Meteor.settings.IronFish);
  const status = await client.nodeStatus();
  console.log('Node status:', status);
});