class AuthInterceptor {
  constructor($rootScope, Promise, authEvents) {
    this.responseError = (response) => {
      switch (response.status) {
        case 401:
          $rootScope.$broadcast(authEvents.notAuthenticated, response);
          break;
        case 403:
          $rootScope.$broadcast(authEvents.notAuthorized, response);
          break;
        case 419:
        case 440:
          $rootScope.$broadcast(authEvents.sessionTimeout, response);
          break;
      }
      return Promise.reject(response);
    }
  }

  static factory($rootScope, $q, AUTH_EVENTS) {
    AuthInterceptor.instance = new AuthInterceptor($rootScope, $q, AUTH_EVENTS);
    return AuthInterceptor.instance;
  }
}

export default angular
  .module('app.factory.auth-interceptor', [])
  .factory('AuthInterceptor', AuthInterceptor.factory)
