const moduleName = 'extensions';

import angular from 'angular';
import PerfectScrollbar from './perfect-scrollbar';
import SelectPicker from './select-picker';
import CommonData from './common-data';
import CommonUtil from './common-util';

angular.module(moduleName, [])
  .factory('CommonData', CommonData.factory)
  .factory('CommonUtil', CommonUtil.factory)
  .directive('perfectScrollbar', PerfectScrollbar.factory)
  .directive('selectPicker', SelectPicker.factory);

export default moduleName;
