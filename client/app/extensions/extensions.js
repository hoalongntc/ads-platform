export default angular.module('app.extensions', [
  require('./constants/auth').name,

  require('./directives/login-dialog').name,
  require('./directives/page-loading').name,
  require('./directives/date-time-picker').name,
  require('./directives/perfect-scrollbar').name,
  require('./directives/select-picker').name,

  require('./factories/auth-inteceptor').name,
  require('./factories/auth-resolver').name,
  require('./factories/auth-service').name,
  require('./factories/common-data').name,
  require('./factories/common-util').name,

  // require('./services/session').name,
]);
