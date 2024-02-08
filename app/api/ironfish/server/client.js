import { fetch } from 'meteor/fetch';

export class IronFishRpcClient {
  constructor({ rpcUrl, auth }) {
    this.rpcUrl = rpcUrl;
    this.auth = auth;
  }

  async rpcStatus() {
    return this.request('rpc/getStatus');
  }

  async nodeStatus() {
    return this.request('node/getStatus');
  }

  async request(method, params) {
    const res = await fetch(`${this.rpcUrl}/${method}`, {
      headers: {
        'Authorization': this.auth,
      },
    });
    return res.json();
  }
}
