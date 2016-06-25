import angular from 'angular';

class AuthInterceptor {
  constructor($rootScope, Promise, authEvents, LoopBackAuth) {
    this.responseError = (response) => {
      switch (response.status) {
        case 401:
          LoopBackAuth.clearUser();
          LoopBackAuth.clearStorage();
          $rootScope.$broadcast(authEvents.notAuthenticated, response);
          break;
        case 403:
          $rootScope.$broadcast(authEvents.notAuthorized, response);
          break;
        case 419:
        case 440:
          LoopBackAuth.clearUser();
          LoopBackAuth.clearStorage();
          $rootScope.$broadcast(authEvents.sessionTimeout, response);
          break;
      }
      return Promise.reject(response);
    };
  }

  static factory($rootScope, $q, AUTH_EVENTS, LoopBackAuth) {
    'ngInject';
    AuthInterceptor.instance = new AuthInterceptor($rootScope, $q, AUTH_EVENTS, LoopBackAuth);
    return AuthInterceptor.instance;
  }
}

export default angular
  .module('app.factory.auth-interceptor', [])
  .factory('AuthInterceptor', AuthInterceptor.factory);
