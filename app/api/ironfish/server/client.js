import { Meteor } from 'meteor/meteor';
import { fetch } from 'meteor/fetch';

export class IronFishRpcClient {
  constructor({ rpcUrl, auth }) {
    this.rpcUrl = rpcUrl;
    this.auth = auth;
  }

  async createAccount(name) {
    return this.request('wallet/createAccount', { name });
  }

  async getAccounts() {
    const { accounts } = await this.request('wallet/getAccounts', {
      default: false,
      displayName: false,
    });
    return accounts;
  }

  async getPublicKey(account) {
    const { publicKey } = await this.request('wallet/getPublicKey', {
      account,
    });
    return publicKey;
  }

  async getBalance(account) {
    const { confirmed } = await this.request('wallet/getBalance', { account });
    return confirmed / 10 ** 8;
  }

  async rpcStatus() {
    return this.request('rpc/getStatus');
  }

  async nodeStatus() {
    return this.request('node/getStatus');
  }

  async request(method, params) {
    try {
      const res = await fetch(`${this.rpcUrl}/${method}`, {
        method: 'post',
        headers: {
          'Authorization': this.auth,
        },
        body: JSON.stringify(params),
      });
      const { status, message, data } = await res.json();
      if (status !== 200) {
        throw new Error(message);
      }
      return data;
    } catch (err) {
      console.error(err);
      throw new Meteor.Error('ironFishRpc', err.message);
    }
  }
}

export const IronFish = new IronFishRpcClient(Meteor.settings.IronFish);
