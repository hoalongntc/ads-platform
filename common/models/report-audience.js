import moment from 'moment';
import lodash from 'lodash';
import Promise from 'bluebird';

module.exports = function(ReportAudience) {
  let app, models;

  const getKeysByDate = (reportDate) => {
    return models.TrackingImpression5
      .find({
        where: {trackingDate: reportDate},
        fields: {advertiserId: 1, campaignId: 1, locationId: 1, bannerId: 1}
      });
  };
  const getTrackingDataByKeys = (filterKeys) => {
    return models.TrackingClick7.find({where: filterKeys});
  };
  const calculateReport = data => {
    const reportTypes = ['os', 'device', 'gender', 'age', 'income'];
    let reportResult = {};
    reportTypes.forEach(type => {
      let report = { };
      const reportCategories = app.get(`SelectOption:${type}_category`) || [];
      reportCategories.forEach(cat => {
        report[cat['value']] = 0;
      });

      reportResult[`report${type[0].toUpperCase() + type.slice(1)}`] = report;
    });
    
    data.forEach(row => {
      calculateDetailReport(row, 'os', reportResult['reportOs']);
      calculateDetailReport(row, 'device', reportResult['reportDevice']);
      calculateDetailReport(row, 'gender', reportResult['reportGender']);
      calculateDetailReport(row, 'age', reportResult['reportAge']);
      calculateDetailReport(row, 'income', reportResult['reportIncome']);
    });

    return Promise.resolve(reportResult);
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
  const calculateDetailReport = (row, key, result) => {
    if (!row[key]) {
      result.other++;
    } else if (~Object.keys(result).indexOf(row[key])) {
      result[row[key]]++;
    } else {
      result.other++;
    }
  };

  const createReport = (key, report) => {
    console.log(report);
    return ReportAudience
      .destroyAll(key)
      .then(() => ReportAudience.create(lodash.extend({}, key, report)))
      .catch(err => {
        console.error(err);
      })
  };
  const updateSumReport = (key) => {
    const collection = ReportAudience.getDataSource().connector.collection(ReportAudience.modelName);
    return collection.aggregate([{
      $match: key
    },{
      $group: {
        _id: null,
        'os_ios': { $sum: '$reportOs.ios' }
      }
    }], (err, data) => {
      console.log(err);
      console.log(data);
    });
  };

  ReportAudience.createReport = (reportDate) => {
    app = ReportAudience.app;
    models = ReportAudience.app.models;
    reportDate = reportDate || moment().startOf('day');

    return getKeysByDate(reportDate)
      .then(keys => Promise.map(keys, key => {
        key = key.toJSON();
        return getTrackingDataByKeys(lodash.extend({}, key, {trackingDate: reportDate}))
          .then(calculateReport)
          .then(report => createReport(lodash.extend({}, key, {reportDate: reportDate}), report))
          .then(report => {
            console.log(report);
            updateSumReport(key)
          });
      }, {concurrency: 3}))
      .catch(err => {
        console.error(err);
      });
  };
};
