import { TemplateController } from 'meteor/space:template-controller';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Campaigns } from '/api/campaigns';
import './create.html';

TemplateController('CampaignCreate', {
  events: {
    async 'submit form'(e) {
      e.preventDefault();
      const form = e.currentTarget;
      const campaignId = await Campaigns.insertAsync({
        name: form['name'].value.trim(),
        description: form['description'].value.trim(),
        contact: form['contact'].value.trim(),
      });
      FlowRouter.go(`/campaign/${campaignId}`);
    },
  },
});
