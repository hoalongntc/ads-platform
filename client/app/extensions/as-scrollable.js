export default class Scrollable {
  constructor() {
    this.scope = {};
  }

  // Directive link function
  link(scope, element, attrs) {
    console.log('link');
    const asScrollableOptions = {
      namespace: "scrollable",
      contentSelector: "> [data-scrollable-content]",
      containerSelector: "> [data-scrollable-container]",

      direction: 'vertical' // vertical, horizontal, both, auto
    };

    const direction = scope.$eval(attrs.asScrollableDirection);
    if (direction) {
      asScrollableOptions.direction = direction;
    }

    const asScrollable = $(element).asScrollable(asScrollableOptions);
    scope.$on('$destroy', () => {
      console.log('link destroy');
      asScrollable.remove();
    });
  }

  static factory() {
    Scrollable.instance = new Scrollable();
    return Scrollable.instance;
  }
}
