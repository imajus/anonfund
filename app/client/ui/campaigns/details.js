import { Meteor } from 'meteor/meteor';
import { TemplateController } from 'meteor/space:template-controller';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Campaigns } from '/api/campaigns';
import { Accounts, TokenContract } from '/api/ethers/client';
import { Transfers } from '/api/transfers';
import './details.html';

TemplateController('CampaignDetails', {
  state: {
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
