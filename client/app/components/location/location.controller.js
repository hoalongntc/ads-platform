import lodash from 'lodash';
import Highcharts from 'highcharts';

export default class LocationCtrl {
  constructor($timeout, CommonUtil) {
    this.$timeout = $timeout;
    this.CommonUtil = CommonUtil;

    this.$timeout(() => {
      this.initLocationPerCityChart();
      this.initLocationPerCategoryChart();
      this.initGenderChart();
      this.initAgeChart();
      this.initIncomeChart();
      this.initDeviceChart();
    }, 500);
  }

  initLocationPerCityChart() {
    this.locationPerCityChartOptions = lodash.merge(this.CommonUtil.defaultChartOptions('pie'), {
      chart: {
        renderTo: 'city_chart',
        height: 200
      },
      title: {
        text: 'City',
        align: 'left',
        verticalAlign: 'middle',
        x: 68
      },
      plotOptions: {
        pie: {
          size: '80%',
          center: [70, 75]
        }
      },
      legend: {
        align: 'left',
        x: 150
      },
      series: [{
        name: 'City',
        data: [{name: 'Ho Chi Minh', y: 100}, {name: 'Ha Noi', y: 110}, {name: 'Da Nang', y: 30}, { name: 'Vung Tau', y: 20}, {name: 'Nha Trang', y: 30}],
        startAngle: 0, innerSize: '50%'
      }]
    });
    this.locationPerCityChart = Highcharts.chart(this.locationPerCityChartOptions);
  }

  initLocationPerCategoryChart() {
    this.locationPerCategoryChartOptions = lodash.merge(this.CommonUtil.defaultChartOptions('pie'), {
      chart: {
        renderTo: 'category_chart',
        height: 200
      },
      title: {
        text: 'Category',
        align: 'left',
        verticalAlign: 'middle',
        x: 50
      },
      plotOptions: {
        pie: {
          size: '80%',
          center: [70, 75]
        }
      },
      legend: {
        align: 'left',
        verticalAlign: 'middle',
        x: 150
      },
      series: [{
        name: 'Category',
        data: [{name: 'Coffee Shops', y: 100}, {name: 'Public areas', y: 110}, { name: 'Airports', y: 30}, {name: 'Universities', y: 20}, {name: 'Shopping Malls', y: 30}],
        startAngle: 0, innerSize: '50%'
      }]
    });
    this.locationPerCategoryChart = Highcharts.chart(this.locationPerCategoryChartOptions);
  }

  initGenderChart() {
    this.genderChartOptions = lodash.merge(this.CommonUtil.defaultChartOptions('pie'), {
      chart: {
        renderTo: 'gender_chart',
        height: 200
      },
      title: {
        text: 'Gender',
        align: 'left',
        verticalAlign: 'middle',
        x: 58
      },
      plotOptions: {
        pie: {
          size: '70%',
          center: [70, 75]
        }
      },
      legend: {
        align: 'left',
        verticalAlign: 'middle',
        x: 150
      },
      series: [{
        name: 'Gender',
        data: [{name: 'Male', y: 100}, {name: 'Female', y: 110}],
        startAngle: 0, innerSize: '50%'
      }]
    });
    this.genderChart = Highcharts.chart(this.genderChartOptions);
  }

  initAgeChart() {
    this.ageChartOptions = lodash.merge(this.CommonUtil.defaultChartOptions('pie'), {
      chart: {
        renderTo: 'age_chart',
        height: 200
      },
      title: {
        text: 'Age',
        align: 'left',
        verticalAlign: 'middle',
        x: 68
      },
      plotOptions: {
        pie: {
          size: '70%',
          center: [70, 75]
        }
      },
      legend: {
        align: 'left',
        verticalAlign: 'middle',
        x: 150
      },
      series: [{
        name: 'Age',
        data: [{name: '18-24', y: 100}, {name: '25-34', y: 110}, {name: '35-44', y: 110}, { name: '45-54', y: 110}, {name: '55+', y: 110}],
        startAngle: 0, innerSize: '50%'
      }]
    });
    this.ageChart = Highcharts.chart(this.ageChartOptions);
  }

  initIncomeChart() {
    this.incomeChartOptions = lodash.merge(this.CommonUtil.defaultChartOptions('pie'), {
      chart: {
        renderTo: 'income_chart',
        height: 200
      },
      title: {
        text: 'Income',
        align: 'left',
        verticalAlign: 'middle',
        x: 58
      },
      plotOptions: {
        pie: {
          size: '70%',
          center: [70, 75]
        }
      },
      legend: {
        align: 'left',
        verticalAlign: 'middle',
        x: 150
      },
      series: [{
        name: 'Income',
        data: [{name: '< $1000', y: 100}, {name: '$1000-$2000', y: 110},
          {name: '$2000-$4000', y: 110}, {name: '$4000-$10000', y: 110},
          {name: '$10000+', y: 110}],
        startAngle: 0, innerSize: '50%'
      }]
    });
    this.incomeChart = Highcharts.chart(this.incomeChartOptions);
  }

  initDeviceChart() {
    this.deviceChartOptions = lodash.merge(this.CommonUtil.defaultChartOptions('pie'), {
      chart: {
        renderTo: 'device_chart',
        height: 200
      },
      title: {
        text: 'Device',
        align: 'left',
        verticalAlign: 'middle',
        x: 58
      },
      plotOptions: {
        pie: {
          size: '70%',
          center: [70, 75]
        }
      },
      legend: {
        align: 'left',
        verticalAlign: 'middle',
        x: 150
      },
      series: [{
        name: 'Device',
        data: [{name: 'Mobile', y: 100},{name: 'Laptop', y: 110},{name: 'Tablet', y: 110}],
        startAngle: 0, innerSize: '50%'
      }]
    });
    this.deviceChart = Highcharts.chart(this.deviceChartOptions);
  }
  
  initCampaignGrid() {
    
  }
}

LocationCtrl.$inject = ['$timeout', 'CommonUtil'];
