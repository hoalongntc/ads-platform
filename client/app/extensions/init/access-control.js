// import angular from 'angular';

export default function ($rootScope, $state, AUTH_EVENTS, USER_ROLES, User) {
  'ngInject';
  $rootScope.$on('$stateChangeStart', (event, next) => {
    const authenticated = User.isAuthenticated();

    if (next.name == 'login' && !authenticated) {
      return;
    }
    if (next.name == 'login' && authenticated) {
      event.preventDefault();
      $state.go('dashboard');
    }

    // let authorizedRoles = next.data ? next.data.authorizedRoles : USER_ROLES.all;
    // if (!angular.isArray(authorizedRoles)) {
    //   authorizedRoles = [authorizedRoles];
    // }

    if (!authenticated) {
      event.preventDefault();
      // user is not allowed
      $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);

      // user is not logged in
      // console.log(AUTH_EVENTS.notAuthenticated);
      // $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
    }
  });
}
