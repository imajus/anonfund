import { Meteor } from 'meteor/meteor';
import { TemplateController } from 'meteor/space:template-controller';
import { Transfers } from '/api/transfers';
import { Campaigns } from '/api/campaigns';
import './donations.html';

TemplateController('Donations', {
  state: {
    key: null,
  },
  async onCreated() {
    this.state.key = await Meteor.callAsync('Users.getViewKey');
  },
  helpers: {
    donations() {
      return Transfers.find({ 'userId': Meteor.userId() }).map((transfer) => ({
        campaign: Campaigns.findOne(transfer.campaignId),
        transfer,
      }));
    },
  },
});
