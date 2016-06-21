class ApplicationCtrl {
  constructor(AuthResolver, AuthService) {
    this.currentUser = null;
    this.AuthService = AuthService;

    // Get currentUser
    const getCurrentUser =() => {
      AuthResolver
        .getCurrentUser()
        .then(user => {
          this.currentUser = user;
        });  
    };
    
    getCurrentUser();
  }

  setCurrentUser(currentUser) {
    this.currentUser = currentUser;
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
