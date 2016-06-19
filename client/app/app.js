import angular from 'angular';
require('angular-resource');
require('bootstrap');
require('lodash');

// STYLES
import '../assets/styles/assets.less';

// JADE TEMPLATE
//@require "./components/**/*.template.jade"

export default angular
  .module('app', [
    require('angular-bluebird-promises'),
    require('angular-ui-router'),
    (() => { require('oclazyload'); return 'oc.lazyLoad' })(),
    require('./app.routing').name,

    // global
    require('../lib/lb-services'),
    require('./extensions/extensions').name
  ]);
