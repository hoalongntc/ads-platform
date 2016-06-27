import angular from 'angular';

export default angular.module('app.routing', [
  require('./components/login/login.routing').name,
  require('./components/dashboard/dashboard.routing').name,
  require('./components/location/location.routing').name,
  require('./components/report/report.routing').name,
  require('./components/campaign/campaign.routing').name,
  require('./components/banner/banner.routing').name
]);
