import angular from 'angular';

class AuthService {
  constructor($rootScope, AUTH_EVENTS, User) {
    this.$rootScope = $rootScope;
    this.authEvents = AUTH_EVENTS;
    this.User = User;
  }

  login(credentials, rememberMe = false) {
    return this.User
      .login({rememberMe: rememberMe}, credentials).$promise
      .then(session => {
        this.$rootScope.$broadcast(this.authEvents.loginSuccess, session);
        return session.user;
      })
      .catch(err => {
        this.$rootScope.$broadcast(this.authEvents.loginFailed, err);
        throw err;
      });
  }

  logout() {
    return this.User
      .logout().$promise
      .then(() => {
        this.$rootScope.$broadcast(this.authEvents.logoutSuccess);
      });
  }

  isAuthenticated() {
    return this.User.isAuthenticated();
  }

  isAuthorized(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (this.isAuthenticated()/* && authorizedRoles.indexOf(this.User.getCu) !== -1*/);
  }

  static factory($rootScope, AUTH_EVENTS, User) {
    "ngInject";
    AuthService.instance = new AuthService($rootScope, AUTH_EVENTS, User);
    return AuthService.instance;
  }
}

export default angular
  .module('app.factory.auth-service', [])
  .factory('AuthService', AuthService.factory);
