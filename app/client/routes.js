import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './ui/layout';
import './ui/home';
import './ui/campaigns/listing';
import './ui/campaigns/funding';
import './ui/campaigns/create';
import './ui/profile';

//TODO: Alternative: redirect to some route, which is "Default"
// FlowRouter.route('/',
//   triggersEnter: [(context, redirect) => redirect('xxx')],
// });

FlowRouter.route('/', {
  action() {
    this.render('Layout', { main: 'Home' });
  },
});

FlowRouter.route('/campaigns', {
  action() {
    this.render('Layout', { main: 'CampaignListing' });
  },
});

FlowRouter.route('/campaign/:_id', {
  action() {
    this.render('Layout', { main: 'CampaignFunding' });
  },
});

FlowRouter.route('/create-campaign', {
  action() {
    this.render('Layout', { main: 'CampaignCreate' });
  },
});

FlowRouter.route('/profile', {
  action() {
    this.render('Layout', { main: 'Profile' });
  },
});
