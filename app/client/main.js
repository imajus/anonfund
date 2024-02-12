import 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import popper from 'popper.js';
import { wrap } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { AutoForm } from 'meteor/aldeed:autoform';
import { BootstrapHelpers, showError } from 'meteor/imajus:bootstrap-helpers';
import { AutoFormThemeBootstrap4 } from 'meteor/communitypackages:autoform-bootstrap4/static';
import 'meteor/aldeed:autoform/static';
import '/init';
import './ui/helpers';
import './api';
import './routes';

global.Popper = popper; // fixes some issues with Popper and Meteor

BootstrapHelpers.forBootstrap4 = true;

AutoFormThemeBootstrap4.load();
AutoForm.setDefaultTemplate('bootstrap4');

if (Meteor.isDevelopment) {
  AutoForm.debug();
}

const DDPConnection = Object.getPrototypeOf(Meteor.connection);
// eslint-disable-next-line no-underscore-dangle
DDPConnection._apply = wrap(DDPConnection._apply, function (orig, ...args) {
  let callback = args.pop();
  if (!callback) {
    callback = args.pop();
  }
  return orig.apply(this, [
    ...args,
    (err, res) => {
      if (err) {
        showError(err);
      }
      callback(err, res);
    },
  ]);
});
