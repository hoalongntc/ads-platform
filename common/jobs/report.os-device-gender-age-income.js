import moment from 'moment';
import Promise from 'bluebird';

export default (app) => {
  console.log(app.get('SelectOption:age_category'));
  const models = app.models;
  const debug = require('debug')('jobs:calculate-daily-report');

  const getKeysByDate = (reportDate) => {
    return models.TrackingImpression3
      .find({
        where: {trackingDate: reportDate},
        fields: {advertiserId: 1, campaignId: 1, locationId: 1, trackingDate: 1}
      });
  };
  const getTrackingDataByKeys = (filterKeys) => {
    return models.TrackingClick7.find({where: filterKeys});
  };
  const calculateReport = data => {
    let genderReport = {male: 0, female: 0, other: 0};
    let osReport = {android: 0, ios: 0, windows_phone: 0, windows: 0, mac: 0, linux: 0, other: 0};
    let deviceReport = {mobile: 0, tablet: 0, pc: 0, other: 0};

    let ageReport = { other: 0 };
    const ageCategories = app.get('SelectOption:age_category');
    if (ageCategories) {
      ageCategories.forEach(cat => {
        ageReport[cat['value']] = 0;
      });
    }

    let incomeReport = { other: 0 };
    const incomeCategories = app.get('SelectOption:income_category');
    if (incomeCategories) {
      incomeCategories.forEach(cat => {
        incomeReport[cat['value']] = 0;
      });
    }

    data.forEach(row => {
      calculateGenderReport(row, genderReport);
      calculateOsReport(row, osReport);
      calculateDeviceReport(row, deviceReport);

      if (ageCategories) {
        calculateAgeReport(row, ageReport);
      }
      if (incomeCategories) {
        calculateIncomeReport(row, incomeReport);
      }
    });

    debug('gender report', genderReport);
    debug('os report', osReport);
    debug('device report', deviceReport);
    debug('age report', ageReport);
    debug('income report', incomeReport);
  };

  const calculateGenderReport = (row, result) => {
    if (!row.gender) {
      result.other++;
    } else if (row.gender == 'male') {
      result.male++;
    } else if (row.gender == 'female') {
      result.female++;
    } else {
      result.other++;
    }
  };
  const calculateOsReport = (row, result) => {
    if (!row.os) {
      result.other++;
    } else if (row.os.match(/android/i)) {
      result.android++;
    } else if (row.os.match(/ios/i)) {
      result.ios++;
    } else if (row.os.match(/windows phone/i)) {
      result.windows_phone++;
    } else if (row.os.match(/windows/i)) {
      result.windows++;
    } else if (row.os.match(/(osx|os x|macos|mac os)/i)) {
      result.mac++;
    } else {
      result.other++;
    }
  };
  const calculateDeviceReport = (row, result) => {
    if (!row.device) {
      result.other++;
    } else if (row.device.match(/mobile/i)) {
      result.mobile++;
    } else if (row.device.match(/tablet/i)) {
      result.tablet++;
    } else if (row.device.match(/(desktop|laptop|pc)/i)) {
      result.pc++;
    } else {
      result.other++;
    }
  };
  const calculateAgeReport = (row, result) => {
    if (!row.age) {
      result.other++;
    } else if (~Object.keys(result).indexOf(row.age)) {
      result[row.age]++;
    } else {
      result.other++;
    }
  };
  const calculateIncomeReport = (row, result) => {
    if (!row.income) {
      result.other++;
    } else if (~Object.keys(result).indexOf(row.income)) {
      result[row.income]++;
    } else {
      result.other++;
    }
  };

  return (job, cb) => {
    const reportDate = moment(job.attrs.data.reportDate || undefined).startOf('day');
    debug('Start calculate-daily-report job', reportDate.toISOString());

    models.ReportAudience.createReport(reportDate)
      .then(() => cb())
      .catch(err => {
        console.error(err);
        cb(err);
      });

    // getKeysByDate(reportDate)
    //   .then(keys => Promise.map(keys, key => {
    //     return getTrackingDataByKeys(key.toJSON())
    //       .then(calculateReport);
    //   }, {concurrency: 3}))
    //   .then(() => cb())
    //   .catch(err => {
    //     console.error(err);
    //     cb(err);
    //   });
  };
};
