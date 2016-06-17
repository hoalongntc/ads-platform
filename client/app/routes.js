routes.$inject = ['$stateProvider', '$urlRouterProvider'];

export default function routes($stateProvider, $urlRouterProvider) {
  // For any unmatched url, redirect to /dashboard
  $urlRouterProvider.otherwise("/dashboard");

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
    .state('banner', {
      url: '/banner/:id?',
      templateUrl: require('./components/banner/banner.jade'),
      controller: 'BannerCtrl',
      controllerAs: 'ban'
    })
    .state('locations', {
      url: '/locations',
      templateUrl: require('./components/location/location.jade'),
      controller: 'LocationCtrl',
      controllerAs: 'loc'
    })
  .state('bannerList', {
      url: '/banners?:orderKey&:orderDirect:&page',
      templateUrl: require('./components/banner/bannerList.jade'),
      controller: 'BannerListCtrl',
      controllerAs: 'banList'
    });
}
