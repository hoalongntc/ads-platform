// GLOBAL IMPORT
// JS
import '../assets/scripts/assets.js'

// STYLES
import '../assets/styles/assets.less'

// TEMPLATE
//@require "./components/**/*.html"
//@require "./components/**/*.jade"

import angular from 'angular';
import uirouter from 'angular-ui-router';
import lbServices from '../lib/lb-services';
import routes from './routes';

import HomeCtrl from './components/home/home.controller'
import NavCtrl from './components/nav/nav.controller'

angular
  .module('app', [uirouter, lbServices])
  .controller('NavCtrl', NavCtrl)
  .controller('HomeCtrl', HomeCtrl)
  .config(routes);
