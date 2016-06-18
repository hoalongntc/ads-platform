// GLOBAL IMPORT
// JS
import '../assets/scripts/assets.js';

// STYLES
import '../assets/styles/assets.less';

// TEMPLATE
//@require "./components/**/*.html"
//@require "./components/**/*.jade"

import angular from 'angular';
import ngResource from 'angular-resource';
import blueBird from 'angular-bluebird-promises';
import uirouter from 'angular-ui-router';
import lbServices from '../lib/lb-services';
import agGrid from 'ag-grid';
import extensions from './extensions/extensions';

agGrid.initialiseAgGridWithAngular1(angular);

import routes from './routes';
import NavCtrl from './components/nav/nav.controller';
import DashboardCtrl from './components/dashboard/dashboard.controller';
import CampaignCtrl from './components/campaign/campaign.controller';
import LocationCtrl from './components/location/location.controller';
import ReportCtrl from './components/report/report.controller';
import CampaignGridCtrl from './components/grid/campaign.grid.controller';

const app = angular.module('app', [blueBird, uirouter, lbServices, 'agGrid', extensions]);
app.config(routes);
app.controller('NavCtrl', NavCtrl);
app.controller('DashboardCtrl', DashboardCtrl);
app.controller('CampaignCtrl', CampaignCtrl);
app.controller('LocationCtrl', LocationCtrl);
app.controller('ReportCtrl', ReportCtrl);
app.controller('CampaignGridCtrl', CampaignGridCtrl);
