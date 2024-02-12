import { Meteor } from 'meteor/meteor';
import { TemplateController } from 'meteor/space:template-controller';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { showToast } from 'meteor/imajus:bootstrap-helpers';
import { Campaigns } from '/api/campaigns';
import { Accounts, TokenContract } from '/api/ethers/client';
import { Transfers } from '/api/transfers';
import './details.html';

const { tokenSymbol } = Meteor.settings.public.Ethereum;

TemplateController('CampaignDetails', {
  state: {
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
    isArchived() {
      const campaign = this.campaign();
      return Boolean(campaign.archivedAt);
    },
    isLoading() {
      return Boolean(this.state.status);
    },
    isError() {
      return this.state.status instanceof Error;
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
  },
  events: {
    async 'submit #withdraw'(e) {
      e.preventDefault();
      const form = e.currentTarget;
      this.state.status = 'Withdrawing Campaign funds...';
      try {
        const address = form['address'].value.replace(/^0x/, '').trim();
        await Meteor.callAsync('Campaigns.close', this.campaignId(), address);
        this.state.status = null;
        form.reset();
        showToast({
          heading: 'Campaign is closed',
          message: `You have successfully withdrawn ${
            this.state.balance / 10 ** 8
          } ${tokenSymbol}`,
          brand: 'success',
        });
      } catch (err) {
        this.state.status = err;
      }
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
