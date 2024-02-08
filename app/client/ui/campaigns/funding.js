import ethers from 'ethers';
import { Meteor } from 'meteor/meteor';
import { TemplateController } from 'meteor/space:template-controller';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Campaigns } from '/api/campaigns';
import { Accounts, TokenContract } from '/api/ethers/client';
import './funding.html';

TemplateController('CampaignFunding', {
  state: {
    balance: null,
  },
  helpers: {
    campaign() {
      return this.campaign();
    },
  },
  events: {
    async 'click [data-action=connect]'() {
      const account = await Accounts.connect();
      const balance = await TokenContract.balanceOf(account);
      this.state.balance = balance.toNumber() / 10 ** 8;
    },
    async 'submit'(e) {
      e.preventDefault();
      const form = e.currentTarget;
      const user = Meteor.user();
      await TokenContract.transferWithMetadata(
        Meteor.settings.public.Ethereum.depositAddress,
        form['amount'].value * 10 ** 8,
        ethers.utils.formatBytes32String(user.address),
      );
    },
  },
  private: {
    campaignId: () => FlowRouter.getParam('_id'),
    campaign() {
      return Campaigns.findOne(this.campaignId());
    },
  },
});
