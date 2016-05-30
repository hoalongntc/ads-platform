routes.$inject = ['$stateProvider', '$urlRouterProvider'];

export default function routes($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /
  $urlRouterProvider.otherwise("/");
  
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: require('./components/home/home.jade'),
      controller: 'HomeCtrl',
      controllerAs: 'home'
    });
}