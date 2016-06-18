import $ from 'jquery';

export default class Scrollable {
  constructor() {
    this.scope = {};
  }

  // Directive link function
  link(scope, element, attrs) {
    const asScrollableOptions = {
      namespace: 'scrollable',
      contentSelector: '> [data-scrollable-content]',
      containerSelector: '> [data-scrollable-container]',

      direction: 'vertical' // vertical, horizontal, both, auto
    };

    const direction = scope.$eval(attrs.asScrollableDirection);
    if (direction) {
      asScrollableOptions.direction = direction;
    }

    const asScrollable = $(element).asScrollable(asScrollableOptions);
    scope.$on('$destroy', () => {
      asScrollable.remove();
    });
  }

  static factory() {
    Scrollable.instance = new Scrollable();
    return Scrollable.instance;
  }
}
