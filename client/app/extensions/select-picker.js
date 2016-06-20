import 'bootstrap-select/dist/js/bootstrap-select';

export default class SelectPicker {
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
