import angular from 'angular'
import ngNiceScroll from './nice-scroll'

export default 'extensions'

angular.module('extensions', [])
  .directive('ngNiceScroll', () => new ngNicescroll);
