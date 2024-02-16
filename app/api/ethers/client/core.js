import { ethers } from 'ethers';

export function getProvider() {
  try {
    return new ethers.providers.Web3Provider(window.ethereum, 'any');
  } catch (e) {
    console.warn('No ethereum provider found');
    return null;
  }
}

export function getSigner() {
  return getProvider()?.getSigner();
}
