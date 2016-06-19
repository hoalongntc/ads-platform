'use strict';

function routes($stateProvider) {
  $stateProvider
    .state('campaigns', {
      url: '/campaigns',
      templateProvider: ($q) => {
        return $q(resolve => {
          // lazy load the view
          require.ensure([], () => resolve(require('./campaign.jade')));
        });
      },
      controller: 'CampaignCtrl',
      controllerAs: 'cam',
      resolve: {
        loadCampaignCtrl: ($q, $ocLazyLoad) => {
          // lazy load the controller
          return $q(resolve => {
            require.ensure([], () => {
              let module = require('./campaign.controller');
              $ocLazyLoad.load({name: module.name});
              resolve(module.controller);
            });
          });
        }
      }
    });
}

export default angular
  .module('campaign.routing', [])
  .config(routes);
