routes.$inject = ['$stateProvider', '$urlRouterProvider'];

export default function routes($stateProvider, $urlRouterProvider) {
  // For any unmatched url, redirect to /dashboard
  $urlRouterProvider.otherwise('/dashboard');

  $stateProvider
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: require('./components/dashboard/dashboard.jade'),
      controller: 'DashboardCtrl',
      controllerAs: 'dash'
    })
    .state('campaigns', {
      url: '/campaigns',
      templateUrl: require('./components/campaign/campaign.jade'),
      controller: 'CampaignCtrl',
      controllerAs: 'cam'
    })
    .state('locations', {
      url: '/locations',
      templateUrl: require('./components/location/location.jade'),
      controller: 'LocationCtrl',
      controllerAs: 'loc'
    })
    .state('reports', {
      url: '/reports',
      templateUrl: require('./components/report/report.jade'),
      controller: 'ReportCtrl',
      controllerAs: 'rep'
    })
    .state('reports.performance', {
      url: '/performance',
      templateUrl: require('./components/report/report.performance.jade')
    })
    .state('reports.placement', {
      url: '/placement',
      templateUrl: require('./components/report/report.placement.jade')
    });
}
