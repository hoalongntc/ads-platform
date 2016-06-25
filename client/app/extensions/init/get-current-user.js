export default function ($rootScope, $q, User) {
  "ngInject";
  return User.getCurrent().$promise
    .then(user => {
      $rootScope.currentUser = user;
      return user;
    })
    .catch(err => {});
}
