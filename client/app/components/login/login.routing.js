'use strict';

function routes($stateProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      template: require('./login.jade'),
      controller: 'LoginCtrl',
      controllerAs: 'login'
    });
}

export default angular
  .module('login.routing', [
    require('./login.controller').name
  ])
  .config(routes);
