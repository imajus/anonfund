import { Meteor } from 'meteor/meteor';
import { TemplateController } from 'meteor/space:template-controller';
import { Campaigns } from '/api/campaigns';
import './listing.html';

TemplateController('CampaignListing', {
  helpers: {
    campaigns() {
      return Campaigns.find(
        { 'archivedAt': null },
        { sort: { createdAt: -1 } },
      );
    },
    isMine(campaign) {
      return campaign.userId === Meteor.userId();
    },
  },
});
