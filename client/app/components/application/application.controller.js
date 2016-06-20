class ApplicationCtrl {
  constructor(AuthResolver, AuthService) {
    this.currentUser = null;
    this.AuthService = AuthService;

    // Get currentUser
    AuthResolver
      .getCurrentUser()
      .then(user => {
        this.currentUser = user;
      });
  }

  logout() {
    this.AuthService.logout();
  }

  isAuthenticated() {
    return this.AuthService.isAuthenticated();
  }
}

export default angular
  .module('application.controller', [])
  .controller('ApplicationCtrl', ApplicationCtrl);
