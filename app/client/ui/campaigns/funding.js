import { Meteor } from 'meteor/meteor';
import { TemplateController } from 'meteor/space:template-controller';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Campaigns } from '/api/campaigns';
import { Accounts, TokenContract } from '/api/ethers/client';
import './funding.html';

const { tokenSymbol } = Meteor.settings.public.Ethereum;

TemplateController('CampaignFunding', {
  state: {
    balance: null,
    status: null,
  },
  helpers: {
    campaign() {
      return this.campaign();
    },
    isLoading() {
      return Boolean(this.state.status);
    },
    isError() {
      return this.state.status instanceof Error;
    },
  },
  events: {
    async 'click [data-action=connect]'() {
      await Accounts.connect();
      await this.updateBalance();
    },
    async 'submit #funding'(e) {
      e.preventDefault();
      const form = e.currentTarget;
      const user = Meteor.user();
      const amount = form['amount'].value * 10 ** 8;
      this.state.status = `Depositing ${tokenSymbol} to IronFish network...`;
      try {
        const tx = await TokenContract.transferWithMetadata(
          Meteor.settings.public.Ethereum.depositAddress,
          amount,
          `0x${user.address}`,
        );
        this.state.status = 'Waiting for the transaction to be confirmed...';
        await tx.wait();
        this.state.status = 'Finalizing funding operation...';
        await Meteor.applyAsync('Campaigns.fund', [this.campaignId(), amount], {
          noRetry: true,
        });
        this.state.status = 'Updating balance...';
        await this.updateBalance();
        this.state.status = null;
        alert('OK');
      } catch (err) {
        this.state.status = err;
      }
    },
    'reset #funding'() {
      this.state.status = null;
    },
  },
  private: {
    campaignId: () => FlowRouter.getParam('_id'),
    campaign() {
      return Campaigns.findOne(this.campaignId());
    },
    async updateBalance() {
      const balance = await TokenContract.balanceOf(Accounts.current.get());
      this.state.balance = balance.toNumber() / 10 ** 8;
    },
  },
});
