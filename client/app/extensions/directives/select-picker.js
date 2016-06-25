import $ from 'jquery';
import angular from 'angular';
import 'bootstrap-select/dist/js/bootstrap-select';

class SelectPicker {
  constructor() {
    this.scope = {};
  }

  // Directive link function
  link(scope, element, attrs) {
    const selectPicker = $(element).selectpicker();
    scope.$on('$destroy', () => {
      selectPicker.remove();
    });
  }

  static factory() {
    SelectPicker.instance = new SelectPicker();
    return SelectPicker.instance;
  }
}

export default angular
  .module('app.directive.select-picker', [])
  .directive('selectPicker', SelectPicker.factory);
