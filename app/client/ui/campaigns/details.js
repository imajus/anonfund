import { Meteor } from 'meteor/meteor';
import { TemplateController } from 'meteor/space:template-controller';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Campaigns } from '/api/campaigns';
import { Accounts, TokenContract } from '/api/ethers/client';
import { Transfers } from '/api/transfers';
import './details.html';

const { tokenSymbol } = Meteor.settings.public.Ethereum;

TemplateController('CampaignDetails', {
  state: {
    balance: null,
    status: null,
    key: null,
  },
  onCreated() {
    this.autorun(async () => {
      this.state.key = await Meteor.callAsync(
        'Campaigns.getViewKey',
        this.campaignId(),
      );
    });
  },
  helpers: {
    isMine() {
      const campaign = this.campaign();
      return campaign.userId === Meteor.userId();
    },
    balance() {
      return this.transfers().reduce(
        (total, transfer) => total + transfer.amount,
        0,
      );
    },
    transfers() {
      return this.transfers();
    },
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
      const campaign = this.campaign();
      const amount = form['amount'].value * 10 ** 8;
      this.state.status = `Please confirm depositing ${tokenSymbol}...`;
      try {
        const tx = await TokenContract.transferWithMetadata(
          Meteor.settings.public.Ethereum.depositAddress,
          amount,
          `0x${user.address}`,
        );
        this.state.status = 'Waiting for the transaction to be confirmed...';
        await tx.wait();
        this.state.status = 'Finalizing funding operation...';
        await Transfers.insertAsync({
          'userId': user._id,
          'campaignId': campaign._id,
          'from': user.address,
          'to': campaign.address,
          'amount': amount,
          'createdAt': new Date(),
        });
        this.state.status = 'Updating balance...';
        await this.updateBalance();
        this.state.status = null;
        form.reset();
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
    transfers() {
      return Transfers.find(
        {
          'campaignId': this.campaignId(),
          //TODO: For demo purposes include pending transfers
          // 'completedAt': { $ne: null }
        },
        { sort: { 'createdAt': -1 } },
      ).fetch();
    },
  },
});
