import { Meteor } from 'meteor/meteor';
import { TemplateController } from 'meteor/space:template-controller';
import { Transfers } from '/api/transfers';
import { Campaigns } from '/api/campaigns';
import './donations.html';

TemplateController('Donations', {
  state: {},
  helpers: {
    donations() {
      return Transfers.find({ 'userId': Meteor.userId() }).map((transfer) => ({
        campaign: Campaigns.findOne(transfer.campaignId),
        transfer,
      }));
    },
  },
});
