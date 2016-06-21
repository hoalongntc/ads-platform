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

    // global
    require('./extensions/extensions').name,
    require('./app.routing').name,
    require('./components/login/login.controller').name,
    require('./components/application/application.controller').name,
    require('../lib/lb-services')
  ])
  // .config(require('./extensions/config/inject-auth'))
  // .run(require('./extensions/init/get-current-user'))
  // .run(require('./extensions/init/access-control'))
  // .run(require('./extensions/init/access-control-handle'));
