import angular from 'angular';
import lodash from 'lodash';
import Highcharts from 'highcharts';

class ReportCtrl {
  constructor($rootScope, $state, $timeout, CommonUtil) {
    this.$timeout = $timeout;
    this.CommonUtil = CommonUtil;

    const onStateChange = (event, toState) => {
      if (toState.name == 'reports.performance') {
        $timeout(() => {
          this.initClickChart();
          this.initImpressionChart();
        }, 500);
      } else if (toState.name == 'reports') {
        $state.go('reports.performance');
      }
    };

    $rootScope.$on('$stateChangeStart', onStateChange);
    onStateChange(null, $state.current);
  }

  initClickChart() {
    this.clickChartOptions = lodash.merge(this.CommonUtil.defaultChartOptions('line'), {
      chart: {
        renderTo: 'click_chart',
        height: 100,
        margin: [10, 0, 20, null]
      },
      title: {
        text: ''
      },
      colors: ['#FBC02D'],
      xAxis: {
        categories: ['May 21', 'May 22', 'May 23', 'May 24', 'May 25']
      },
      yAxis: {
        title: {
          enabled: false
        },
        tickInterval: 50
      },
      legend: {
        enabled: false
      },
      plotOptions: {},
      series: [{
        name: 'Click',
        data: [100, 120, 110, 130, 150]
      }]
    });
    this.clickChart = Highcharts.chart(this.clickChartOptions);
  }

  initImpressionChart() {
    this.impressionChartOptions = lodash.merge(this.CommonUtil.defaultChartOptions('line'), {
      chart: {
        renderTo: 'impression_chart',
        height: 100,
        margin: [10, 0, 20, null]
      },
      title: {
        text: ''
      },
      colors: ['#46BE8A'],
      xAxis: {
        categories: ['May 21', 'May 22', 'May 23', 'May 24', 'May 25']
      },
      yAxis: {
        title: {
          enabled: false
        },
        tickInterval: 50
      },
      legend: {
        enabled: false
      },
      plotOptions: {},
      series: [{
        name: 'Impression',
        data: [100, 120, 110, 130, 150]
      }]
    });
    this.impressionChart = Highcharts.chart(this.impressionChartOptions);
  }

}

export default angular.module('report.controller', [])
  .controller('ReportCtrl', ReportCtrl);
