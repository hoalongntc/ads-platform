export default class NiceScroll {
  constructor($parse) {
    this.$parse = $parse;
    this.scope = {};
  }

  // Directive compile function
  compile() {
  }

  // Directive link function
  link(scope, element, attrs) {
    const niceOption = scope.$eval(attrs.niceOption);
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
