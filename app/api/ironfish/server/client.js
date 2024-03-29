import { Meteor } from 'meteor/meteor';
import { fetch } from 'meteor/fetch';

export class IronFishRpcClient {
  constructor({ rpcUrl, auth }) {
    this.rpcUrl = rpcUrl;
    this.auth = auth;
  }

  async createAccount(name) {
    const { publicAddress } = await this.request('wallet/createAccount', {
      name,
    });
    return publicAddress;
  }

  async importAccount(key, account) {
    const { name } = await this.request('wallet/importAccount', {
      account: key,
      name: account,
    });
    return name;
  }

  async removeAccount(account) {
    await this.request('wallet/remove', {
      account,
      confirm: true,
      wait: false,
    });
  }

  async getAccounts() {
    const { accounts } = await this.request('wallet/getAccounts', {
      default: false,
      displayName: false,
    });
    return accounts;
  }

  async getAccountStatus(account) {
    const result = await this.request('wallet/getAccountStatus', {
      account,
    });
    return result.account;
  }

  async getViewKey(account) {
    const { account: key } = await this.request('wallet/exportAccount', {
      account,
      viewOnly: true,
      format: 'Bech32',
    });
    return key;
  }

  async getPublicKey(account) {
    const { publicKey } = await this.request('wallet/getPublicKey', {
      account,
    });
    return publicKey;
  }

  async getBalance(account) {
    const { confirmed } = await this.request('wallet/getBalance', { account });
    return Number.parseInt(confirmed, 10);
  }

  async getTransactions(account) {
    try {
      const res = await fetch(`${this.rpcUrl}/wallet/getAccountTransactions`, {
        method: 'post',
        headers: this.headers(),
        body: JSON.stringify({ account }),
      });
      // Dump solution which works for demo
      const text = await res.text();
      const chunks = await text.split('\f').map(JSON.parse);
      if (chunks.length > 0) {
        const { status, message } = chunks.pop();
        if (status !== 200) {
          throw new Error(message);
        }
        return chunks.map(({ data }) => data);
      }
      throw new Error('Server response is empty');
    } catch (err) {
      console.error(err);
      throw new Meteor.Error('ironFishRpc', err.message);
    }
  }

  async getTransaction(hash, account = null) {
    const { transaction } = await this.request('wallet/getAccountTransaction', {
      hash,
      account,
    });
    return transaction;
  }

  async getNotes(account) {
    const { notes } = await this.request('wallet/getNotes', { account });
    //TODO: Support pagination
    return notes;
  }

  async sendTransaction(account, address, amount, memo = '') {
    const { hash, transaction } = await this.request('wallet/sendTransaction', {
      account,
      outputs: [
        {
          publicAddress: address,
          amount,
          memo,
          assetId: Meteor.settings.public.IronFish.assetId,
        },
      ],
      fee: String(Meteor.settings.public.IronFish.fee),
    });
    return { hash, transaction };
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
        headers: this.headers(),
        body: JSON.stringify(params),
      });
      if (res.ok) {
        const { status, message, data } = await res.json();
        if (status === 200) {
          return data;
        }
        throw new Error(message);
      } else if (res.status === 400) {
        const { message } = await res.json();
        throw new Error(message);
      } else {
        throw new Error(`HTTP#${res.status}: ${res.statusText}`);
      }
    } catch (err) {
      console.error(err);
      throw new Meteor.Error('ironFishRpc', err.message);
    }
  }

  headers() {
    return {
      'Authorization': this.auth,
    };
  }
}

export const IronFish = new IronFishRpcClient(Meteor.settings.IronFish);
