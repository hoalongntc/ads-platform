import angular from 'angular';
import $ from 'jquery';

export default class NiceScroll {
  constructor($parse) {
    this.$parse = $parse;
    this.scope = {};
  }

  // Directive link function
  link(scope, element, attrs) {
    const defaultOptions = {
      cursorcolor: '#526069',
      cursorwidth: '3px',
      cursorborder: 'none',
      cursoropacitymax: 0.7,
      scrollspeed: 100,
      mousescrollstep: 100
    };
    const niceOption = angular.extend({}, defaultOptions, scope.$eval(attrs.niceOption));
    const niceScroll = $(element).niceScroll(niceOption);
    const nice = $(element).getNiceScroll();

    if (attrs.niceScrollObject) {
      this.$parse(attrs.niceScrollObject).assign(scope, nice);
    }
    // on scroll end
    niceScroll.onscrollend = function (data) {
      if (this.newscrolly >= this.page.maxh) {
        if (attrs.niceScrollEnd) scope.$evalAsync(attrs.niceScrollEnd);
      }
      if (data.end.y <= 0) {
        // at top
        if (attrs.niceScrollTopEnd) scope.$evalAsync(attrs.niceScrollTopEnd);
      }
    };
    scope.$on('$destroy', () => {
      if (angular.isDefined(niceScroll.version)) {
        niceScroll.remove();
      }
    })
  }

  static factory($parse) {
    NiceScroll.instance = new NiceScroll($parse);
    return NiceScroll.instance;
  }
}

NiceScroll.factory.$inject = ['$parse'];
