'use strict';
import angular from 'angular';

function routes($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/dashboard');

  $stateProvider
    .state('dashboard', {
      url: '/dashboard',
      templateProvider: ($q) => {
        return $q(resolve => {
          // lazy load the view
          require.ensure([], () => resolve(require('./dashboard.jade')));
        });
      },
      controller: 'DashboardCtrl as dash',
      resolve: {
        currentUser: (AuthResolver) => {
          return AuthResolver.getCurrentUser();
        },
        loadCtrl: ($q, $ocLazyLoad) => {
          // lazy load the controller
          return $q(resolve => {
            require.ensure([], () => {
              let module = require('./dashboard.controller');
              $ocLazyLoad.load({name: module.name});
              resolve(module.controller);
            });
          });
        }
      }
    });
}

export default angular
  .module('dashboard.routing', [])
  .config(routes);
