import { Meteor } from 'meteor/meteor';
import { getProvider } from './core';

export { Accounts } from './accounts';
export { TokenContract } from './token';

Meteor.startup(async () => {
  const provider = getProvider();
  if (provider) {
    const { chainId } = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    console.log(
      `Ethers is connected to #${chainId}, the latest block is #${blockNumber}`,
    );
  } else {
    console.warn('Ethers is not detected');
  }
});
