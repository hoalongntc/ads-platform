class LoginCtrl {
  constructor(AuthService) {
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
