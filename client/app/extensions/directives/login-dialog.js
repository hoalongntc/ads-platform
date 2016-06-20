class LoginDialog {
  constructor(authEvents) {
    this.authEvents = authEvents;

    this.restrict = 'A';
    this.template = `<div ng-if="visible" ng-include="'login/login.form.template.jade'"></div>`
  }

  link(scope) {
    const showDialog = () => {
      console.log('notAuthenticated');
      scope.visible = true;
    };

    scope.visible = false;
    scope.$on(this.authEvents.notAuthenticated, showDialog);
    scope.$on(this.authEvents.sessionTimeout, showDialog)
  }
  
  static factory(AUTH_EVENTS) {
    "ngInject";
    LoginDialog.instance = new LoginDialog(AUTH_EVENTS);
    return LoginDialog.instance;
  }
}

export default angular
  .module('app.directive.login-dialog', [])
  .directive('loginDialog', LoginDialog.factory);
