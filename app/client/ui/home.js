import { TemplateController } from 'meteor/space:template-controller';
import { Campaigns } from '/api/campaigns';
import './home.html';

TemplateController('Home', {
  helpers: {
    campaigns() {
      return Campaigns.find({}, { sort: { createdAt: -1 } });
    },
  },
});
