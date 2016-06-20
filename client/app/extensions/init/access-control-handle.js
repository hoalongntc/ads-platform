export default function ($rootScope, $location, $state, AUTH_EVENTS) {

  const goLogin = (event, next) => {
    if ($state.current && $state.current.name !== 'login') {
      $location.beforeLogin = $state.current.name;
      $state.go('login');
    }
  };

  $rootScope.$on(AUTH_EVENTS.loginFailed, (event, next) => {
    console.log('login failed');
  });
  $rootScope.$on(AUTH_EVENTS.loginSuccess, (event, next) => {
    let beforeLogin = $location.beforeLogin || 'dashboard';
    if (beforeLogin == 'login') {
      beforeLogin = 'dashboard';
    }
    $state.go(beforeLogin);
  });
  $rootScope.$on(AUTH_EVENTS.logoutSuccess, goLogin);
  $rootScope.$on(AUTH_EVENTS.notAuthenticated, goLogin);
  $rootScope.$on(AUTH_EVENTS.notAuthorized, (event, next) => {
    console.log('not authorized');
  });
  $rootScope.$on(AUTH_EVENTS.sessionTimeout, goLogin);
}
