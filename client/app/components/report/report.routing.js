'use strict';

function routes($stateProvider) {
  $stateProvider
    .state('reports', {
      url: '/reports',
      controller: 'ReportCtrl',
      controllerAs: 'rep',
      resolve: {
        loadLocationCtrl: ($q, $ocLazyLoad) => {
          // lazy load the controller
          return $q(resolve => {
            require.ensure([], () => {
              let module = require('./report.controller');
              $ocLazyLoad.load({name: module.name});
              resolve(module.controller);
            });
          });
        }
      },
      templateProvider: ($q) => {
        return $q(resolve => {
          // lazy load the view
          require.ensure([], () => resolve(require('./report.jade')));
        });
      }
    })
    .state('reports.performance', {
      url: '/performance',
      templateProvider: ($q) => {
        return $q(resolve => {
          // lazy load the view
          require.ensure([], () => resolve(require('./report.performance.jade')));
        });
      }
    })
    .state('reports.placement', {
      url: '/placement',
      templateProvider: ($q) => {
        return $q(resolve => {
          // lazy load the view
          require.ensure([], () => resolve(require('./report.placement.jade')));
        })
      }
    });
}

export default angular
  .module('report.routing', [])
  .config(routes);
