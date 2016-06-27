'use strict';
import angular from 'angular';

function routes($stateProvider) {
  $stateProvider
    .state('locations', {
      url: '/locations',
      templateProvider: ($q) => {
        return $q(resolve => {
          // lazy load the view
          require.ensure([], () => resolve(require('./location.jade')));
        });
      },
      controller: 'LocationCtrl',
      controllerAs: 'loc',
      resolve: {
        loadLocationCtrl: ($q, $ocLazyLoad) => {
          // lazy load the controller
          return $q(resolve => {
            require.ensure([], () => {
              let module = require('./location.controller');
              $ocLazyLoad.load({name: module.name});
              resolve(module.controller);
            });
          });
        }
      }
    });
}

export default angular
  .module('location.routing', [])
  .config(routes);
