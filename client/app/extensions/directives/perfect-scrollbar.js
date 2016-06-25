import angular from 'angular';
import Ps from 'perfect-scrollbar';

class PerfectScrollbar {
  constructor() {
    this.scope = {};
  }

  // Directive link function
  link(scope, element, attrs) {
    element = element[0];
    const options = {
      wheelSpeed: 1,
      wheelPropagation: true,
      minScrollbarLength: 20
    };

    const direction = scope.$eval(attrs.perfectScrollbarDirection);
    if (direction == 'vertical') {
      options.suppressScrollX = 1;
    } else if (direction == 'horizontal') {
      options.suppressScrollY = 1;
    } else if (direction == 'both') {
      options.useBothWheelAxes = 1;
    } else {
      options.suppressScrollX = 1; // Vertical is default
    }

    Ps.initialize(element, options);
    scope.$on('$destroy', () => {
      Ps.destroy(element);
    });
  }

  static factory() {
    PerfectScrollbar.instance = new PerfectScrollbar();
    return PerfectScrollbar.instance;
  }
}

export default angular
  .module('app.directive.perfect-scrollbar', [])
  .directive('perfectScrollbar', PerfectScrollbar.factory);
