import { Meteor } from 'meteor/meteor';
import { TemplateController } from 'meteor/space:template-controller';
import './verify.html';

TemplateController('Verify', {
  state: {
    transactions: null,
  },
  events: {
    async 'submit #verify'(e) {
      e.preventDefault();
      const form = e.currentTarget;
      const key = form['key'].value.trim();
      this.state.transactions = await Meteor.call('IronFish.transactions', key);
    },
  },
});
