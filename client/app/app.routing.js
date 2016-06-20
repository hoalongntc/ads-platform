export default angular.module('app.routing', [
  require('./components/dashboard/dashboard.routing').name,
  require('./components/location/location.routing').name,
  require('./components/report/report.routing').name,
  require('./components/campaign/campaign.routing').name,
  require('./components/banner/banner.routing').name
]);
