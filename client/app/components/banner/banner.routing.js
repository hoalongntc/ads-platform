'use strict';

function routes($stateProvider) {
  $stateProvider
    .state('banner', {
      url: '/banner/:id?',
      templateProvider: ($q) => {
        return $q(resolve => {
          // lazy load the view
          require.ensure([], () => resolve(require('./banner.jade')));
        });
      },
      controller: 'BannerCtrl',
      controllerAs: 'ban',
      resolve: {
        loadBannerCtrl: ($q, $ocLazyLoad) => {
          // lazy load the controller
          return $q(resolve => {
            require.ensure([], () => {
              let module = require('./banner.controller');
              $ocLazyLoad.load({name: module.name});
              resolve(module.controller);
            });
          });
        }
      }
    })
    .state('bannerList', {
      url: '/banners?:orderKey&:orderDirect:&page',
      templateProvider: ($q) => {
        return $q(resolve => {
          // lazy load the view
          require.ensure([], () => resolve(require('./bannerList.jade')));
        });
      },
      controller: 'BannerListCtrl',
      controllerAs: 'banList',
      resolve: {
        loadBannerListCtrl: ($q, $ocLazyLoad) => {
          // lazy load the controller
          return $q(resolve => {
            require.ensure([], () => {
              let module = require('./bannerList.controller');
              $ocLazyLoad.load({name: module.name});
              resolve(module.controller);
            });
          });
        }
      }
    })
    .state('bannerPreview', {
      url: '/bannersPreview/:id?',
      templateProvider: ($q) => {
        return $q(resolve => {
          // lazy load the view
          require.ensure([], () => resolve(require('./bannerPreview.jade')));
        });
      },
      controller: 'BannerPreviewCtrl',
      controllerAs: 'banPreview',
      resolve: {
        loadBannerPreviewCtrl: ($q, $ocLazyLoad) => {
          // lazy load the controller
          return $q(resolve => {
            require.ensure([], () => {
              let module = require('./bannerPreview.controller');
              $ocLazyLoad.load({name: module.name});
              resolve(module.controller);
            });
          });
        }
      }
    });
}

export default angular
  .module('banner.routing', [])
  .config(routes);
