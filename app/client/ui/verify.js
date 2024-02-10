import { Meteor } from 'meteor/meteor';
import { TemplateController } from 'meteor/space:template-controller';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
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
