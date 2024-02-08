import { Meteor } from 'meteor/meteor';
import { TemplateController } from 'meteor/space:template-controller';
import './home.html';

TemplateController('Home', {
  state: {
    accounts: [],
  },
  async onCreated() {
    this.state.accounts = await Meteor.callAsync('IronFish.accounts');
  },
  events: {
    async 'click [data-action="createAccount"]'() {
      const { accounts } = this.state;
      const { name, publicAddress: address } = await Meteor.callAsync(
        'IronFish.createAccount',
      );
      accounts.push({ name, address, balance: 0 });
      this.state.accounts = accounts;
    },
  },
});
