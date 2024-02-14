import { Meteor } from 'meteor/meteor';
import { TemplateController } from 'meteor/space:template-controller';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Transfers } from '/api/transfers';
import { Campaigns } from '/api/campaigns';
import './verify.html';

TemplateController('Verify', {
  state: {
    notes: null,
  },
  onCreated() {
    this.autorun(async () => {
      const key = this.key();
      if (key) {
        this.state.notes = await Meteor.callAsync('IronFish.notes', key);
      }
    });
  },
  helpers: {
    key() {
      return this.key();
    },
  },
  events: {
    async 'submit #verify'(e) {
      e.preventDefault();
      const form = e.currentTarget;
      const key = form['key'].value.trim();
      FlowRouter.setQueryParams({ key });
    },
  },
  private: {
    key() {
      return FlowRouter.getQueryParam('key');
    },
  },
});

TemplateController('ironFishAddressBadge', {
  helpers: {
    isBridgeAddress() {
      const { address } = this.data;
      return address === Meteor.settings.public.IronFish.bridgeAddress;
    },
    isTransferAddress() {
      const { address } = this.data;
      return Transfers.find({ address }).count() > 0;
    },
    transferByAddress() {
      const { address } = this.data;
      return Transfers.findOne({ address });
    },
    isCampaignAddress() {
      const { address } = this.data;
      return Campaigns.find({ address }).count() > 0;
    },
    campaignByAddress() {
      const { address } = this.data;
      return Campaigns.findOne({ address });
    },
  },
});
