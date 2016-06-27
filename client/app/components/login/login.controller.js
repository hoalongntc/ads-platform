import angular from 'angular';

class LoginCtrl {
  constructor(AuthService, $scope) {
    this.$scope = $scope;
    this.AuthService = AuthService;

    this.credentials = {
      username: '',
      password: ''
    };
    this.errorMessage = '';
  }

  login(credentials) {
    this.errorMessage = null;
    this.AuthService.login(credentials)
      .then(user => {
        if (this.$scope.$parent.app) {
          this.$scope.$parent.app.setCurrentUser(user);
        }
      })
      .catch(err => {
        if (err && err.data && err.data.error) {
          this.errorMessage = err.data.error.message;
        }
      });
  }
}

export default angular
  .module('login.controller', [])
  .controller('LoginCtrl', LoginCtrl);
