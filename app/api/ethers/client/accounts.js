import { ReactiveVar } from 'meteor/reactive-var';
import { getProvider } from './core';

export const Accounts = {
  connected: new ReactiveVar([]),
  current: new ReactiveVar(),
  isConnected() {
    return Boolean(this.connected.get()?.length > 0);
  },
  async init() {
    const accounts = await getProvider()?.listAccounts();
    if (accounts) {
      this.connected.set(accounts);
      if (accounts.length > 0) {
        this.current.set(accounts[0]);
      }
    }
  },
  async connect() {
    const accounts = await getProvider()?.send('eth_requestAccounts', []);
    if (accounts) {
      this.connected.set(accounts);
      if (accounts.length > 0) {
        this.current.set(accounts[0]);
        return accounts[0];
      }
    }
    return null;
  },
};
