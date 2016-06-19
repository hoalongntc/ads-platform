import lodash from 'lodash';

export default class CommonUtil {
  constructor($interpolate, $templateCache) {
    this.$interpolate = $interpolate;
    this.$templateCache = $templateCache;

    // Default data
    this._defaultChartColors = [
      '#70A532', '#FBC02D', '#E98F2E', '#715146', '#3583CA', '#37A9B7', '#178D81', '#279566', '#D6494B', '#E53B75', '#6D45BC', '#465BD4',
      '#BAD896', '#F8E59B', '#F6BE80', '#B98E7E', '#A2CAEE', '#9AE1E9', '#79D1C9', '#7DD3AE', '#FA9898', '#FB8DB4', '#BBA7E4', '#9DAAF3'
    ];
    this._defaultChartOptions = {
      common: {
        exporting: { enabled: true },
        credits: { enabled: false },
        title: {
          text: 'Chart',
          align: 'center',
          verticalAlign: 'top',
          style:
          {
            fontWeight: 'bold',
            fontSize: '13px'
          },
          floating: true
        },
        colors: this._defaultChartColors,
        tooltip: {
          shared: true,
          useHTML: true
        },
        plotOptions: {
          pie: {
            size: '50%',
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            },
            showInLegend: true
          }
        },
        legend: {
          enabled: true,
          align: 'right',
          verticalAlign: 'middle',
          layout: 'vertical',
          symbolRadius: 6,
          symbolHeight: 12,
          symbolWidth: 12,
          itemMarginTop: 5,
          itemStyle: {
            fontSize: '9px',
            fontWeight: 'bold'
          }
        }
      },
      pie: {
        chart: {
          type: 'pie',
          margin: [10, 0, 0, 0]
        },
        tooltip: {
          formatter: function() {
            const template = $templateCache.get('template/chart.pie.tooltip.jade');
            const compiledTemplate = $interpolate(template)(this);
            return compiledTemplate;
          }
        }
      },
      line: {
        chart: {
          type: 'line'
        }
      }
    };
  }

  defaultChartColors(colors) {
    if (colors) {
      this._defaultChartColors = colors;
    }
    return this._defaultChartColors;
  }

  defaultChartOptions(chartType) {
    let options = lodash.cloneDeep(this._defaultChartOptions.common);
    if (chartType && this._defaultChartOptions.hasOwnProperty(chartType)) {
      options = lodash.merge(options, this._defaultChartOptions[chartType]);
    }

    return options;
  }

  static factory($interpolate, $templateCache) {
    CommonUtil.instance = new CommonUtil($interpolate, $templateCache);
    return CommonUtil.instance;
  }
}

CommonUtil.factory.$inject = ['$interpolate', '$templateCache'];
