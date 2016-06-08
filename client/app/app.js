// GLOBAL IMPORT
// JS
import '../assets/scripts/assets.js'

// STYLES
import '../assets/styles/assets.less'

// TEMPLATE
//@require "./components/**/*.html"
//@require "./components/**/*.jade"

import angular from 'angular';
import ngResource from 'angular-resource'
import uirouter from 'angular-ui-router';
import lbServices from '../lib/lb-services';
import extensions from './extensions/extensions';

import routes from './routes';
import HomeCtrl from './components/home/home.controller';
import NavCtrl from './components/nav/nav.controller';
import LocationCtrl from './components/location/location.controller';
import CampaignCtrl from './components/campaign/campaign.controller';

const app = angular.module('app', [uirouter, lbServices, extensions]);
app.config(routes);
app.controller('NavCtrl', NavCtrl);
app.controller('HomeCtrl', HomeCtrl);
app.controller('LocationCtrl', LocationCtrl);
app.controller('CampaignCtrl', CampaignCtrl);
