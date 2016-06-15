import moment from 'moment';
import Promise from 'bluebird';

export default function (app, agenda) {
  const models = app.models;
  const debug = require('debug')('jobs:calculate-daily-report');

  const getKeysByDate = (reportDate) => {
    return models.TrackingImpression3
      .find({
        where: {trackingDate: reportDate},
        fields: {advertiserId: 1, campaignId: 1, hotspotId: 1, trackingDate: 1}
      });
  };

  const getTrackingDataByKeys = (filterKeys) => {
    return models.TrackingClick7.find({where: filterKeys});
  };

  const calculateReport = data => {
    let genderReport = {male: 0, female: 0, other: 0};
    let osReport = {android: 0, ios: 0, windows_phone: 0, windows: 0, mac: 0, linux: 0, other: 0};
    let deviceReport = {mobile: 0, tablet: 0, pc: 0, other: 0};

    return Promise
      .map(data, row => {
        return Promise.all([
          calculateGenderReport(row, genderReport),
          calculateOsReport(row, osReport),
          calculateDeviceReport(row, deviceReport)
        ]);
      }, {concurrency: 10})
      .then(() => {
        debug('gender report', genderReport);
        debug('os report', osReport);
        debug('device report', deviceReport);
        return Promise.resolve(genderReport);
      });
  };

  const calculateGenderReport = (row, result) => {
    if (!row.gender )
      result.other++;
    else if (row.gender == 'male')
      result.male++;
    else if (row.gender == 'female')
      result.female++;
    else
      result.other++;
  };
  const calculateOsReport = (row, result) => {
    if (!row.os)
      result.other++;
    else if (row.os.match(/android/i))
      result.android++;
    else if (row.os.match(/ios/i))
      result.ios++;
    else if (row.os.match(/windows phone/i))
      result.windows_phone++;
    else if (row.os.match(/windows/i))
      result.windows++;
    else if (row.os.match(/(osx|os x|macos|mac os)/i))
      result.mac++;
    else
      result.other++;
  };
  const calculateDeviceReport = (row, result) => {
    if (!row.device)
      result.other++;
    else if (row.device.match(/mobile/i))
      result.mobile++;
    else if (row.device.match(/tablet/i))
      result.tablet++;
    else if (row.device.match(/(desktop|laptop|pc)/i))
      result.pc++;
    else
      result.other++;
  };

  agenda.define('calculate-daily-report', {concurrency: 1, priority: 'normal'}, (job, cb) => {
    const reportDate = moment(job.attrs.data.reportDate || undefined).startOf('day');
    debug('Start calculate-daily-report job', reportDate.toISOString());

    getKeysByDate(reportDate)
      .then(keys => Promise.map(keys, key => {
        return getTrackingDataByKeys(key.toJSON())
          .then(calculateReport);
      }, {concurrency: 3}))
      .then(() => cb())
      .catch(err => {
        console.error(err);
        cb(err);
      });
  });
};
