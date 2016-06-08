const moduleName = 'extensions';

import angular from 'angular'
import NiceScroll from './nice-scroll'
import CommonData from './common-data'

angular.module(moduleName, [])
  .factory('CommonData', CommonData.factory)
  .directive('niceScroll', NiceScroll.factory);

export default moduleName;
