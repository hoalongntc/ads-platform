routes.$inject = ['$stateProvider', '$urlRouterProvider'];

export default function routes($stateProvider, $urlRouterProvider) {
  // For any unmatched url, redirect to /
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: require('./components/home/home.jade'),
      controller: 'HomeCtrl',
      controllerAs: 'home'
    })
    .state('locations', {
      url: '/locations',
      templateUrl: require('./components/location/location.jade'),
      controller: 'LocationCtrl',
      controllerAs: 'loc'
    })
    .state('campaigns', {
      url: '/campaigns',
      templateUrl: require('./components/campaign/campaign.jade'),
      controller: 'CampaignCtrl',
      controllerAs: 'cam'
    })
    .state('banner', {
      url: '/banner',
      templateUrl: require('./components/banner/banner.jade'),
      controller: 'BannerCtrl',
      controllerAs: 'ban'
    });
}
