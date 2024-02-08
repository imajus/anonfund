import { Meteor } from 'meteor/meteor';
import { ethers } from 'ethers';
import abi from './token.json';
import { getProvider } from './core';

export const TokenContract = new ethers.Contract(
  Meteor.settings.public.Ethereum.tokenAddress,
  abi,
  getProvider(),
);
