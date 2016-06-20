export default function ($rootScope, $q, User) {
  return User.getCurrent().$promise
    .then(user => {
      $rootScope.currentUser = user;
      return user;
    })
    .catch(err => {});
}
