export default angular.module('app.extensions', [])
  .factory('CommonData', require('./common-data').factory)
  .factory('CommonUtil', require('./common-util').factory)
  .directive('dateTimePicker', require('./date-time-picker').factory)
  .directive('perfectScrollbar', require('./perfect-scrollbar').factory)
  .directive('selectPicker', require('./select-picker').factory);
