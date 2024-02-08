import { Meteor } from 'meteor/meteor';
import { TemplateController } from 'meteor/space:template-controller';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './create.html';

TemplateController('CampaignCreate', {
  events: {
    async 'submit form'(e) {
      e.preventDefault();
      const form = e.currentTarget;
      const campaignId = await Meteor.callAsync(
        'Campaigns.create',
        form['name'].value.trim(),
        form['description'].value.trim(),
        form['contact'].value.trim(),
      );
      FlowRouter.go(`/campaign/${campaignId}`);
    },
  },
});
