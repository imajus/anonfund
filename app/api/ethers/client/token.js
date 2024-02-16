import { Meteor } from 'meteor/meteor';
import { ethers } from 'ethers';
import abi from './token.json';
import { getSigner } from './core';

export const TokenContract = new ethers.Contract(
  Meteor.settings.public.Scroll.tokenAddress,
  abi,
  getSigner(),
);
