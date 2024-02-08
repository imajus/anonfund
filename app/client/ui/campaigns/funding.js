import { TemplateController } from 'meteor/space:template-controller';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Campaigns } from '/api/campaigns';
import { Accounts } from '/api/ethers/client';
import './funding.html';

TemplateController('CampaignFunding', {
  helpers: {
    campaign() {
      return this.campaign();
    },
  },
  events: {
    async 'click [data-action=connect]'() {
      await Accounts.connect();
    },
  },
  private: {
    campaignId: () => FlowRouter.getParam('_id'),
    campaign() {
      return Campaigns.findOne(this.campaignId());
    },
  },
});
