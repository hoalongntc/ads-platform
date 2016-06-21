import moment from 'moment';
import '../../../assets/scripts/vendor/bootstrap-datetimepicker';

class DateTimePicker {
  constructor($timeout) {
    this.$timeout = $timeout;

    this.require = '?ngModel';
    this.restrict = 'AE';
    this.scope = {options: "=?", onChange: "&?", onClick: "&?"};
  }

  link (scope, element, attrs, ngModel) {
    const dp = $(element).datetimepicker(scope.options);

    scope.$watch('options', (newValue) => {
      const dtp = element.data('DateTimePicker');
      $.map(newValue, (value, key) => {
        dtp[key](value);
      });
    });

    ngModel.$render = () => {
      element.data('DateTimePicker').date(ngModel.$viewValue || null);
    };

    element.on('dp.change', e => {
      this.$timeout(() => {
        scope.$apply(() => {
          ngModel.$setViewValue(e.date);
        });
        if (typeof scope.onChange === "function") {
          scope.onChange();
        }
      });
    });

    element.on('click', () => {
      this.$timeout(() => {
        if (typeof scope.onClick === "function") {
          scope.onClick();
        }
      });
    });

    this.$timeout(() => {
      if (ngModel.$viewValue !== undefined && ngModel.$viewValue !== null) {
        if (!(ngModel.$viewValue instanceof moment)) {
          ngModel.$setViewValue(moment(scope.date));
        }
        element.data('DateTimePicker').date(ngModel.$viewValue);
      }
    });
  }

  static factory($timeout) {
    "ngInject";
    DateTimePicker.instance = new DateTimePicker($timeout);
    return DateTimePicker.instance;
  }
}

export default angular
  .module('app.directive.date-time-picker', [])
  .directive('dateTimePicker', DateTimePicker.factory);
