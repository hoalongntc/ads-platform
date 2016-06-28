import moment from 'moment';
import lodash from 'lodash';
import Promise from 'bluebird';

export default (app) => {
  const models = app.models;
  const debug = require('debug')('jobs:report.audience');

  const getKeysByDate = (keyModel, keyFields, reportDate) => {
    if (!keyFields) {
      return Promise.resolve([{}]);
    }
    const collection = keyModel.getDataSource().connector.collection(keyModel.modelName);

    return new Promise((resolve, reject) => {
      collection.aggregate([{
        $match: {
          createdAt: {$gte: moment(reportDate).startOf('day').toDate(), $lte: moment(reportDate).endOf('day').toDate()}
        }
      }, {
        $group: {
          _id: keyFields
        }
      }], (err, data) => {
        if (err) {
          reject(err);
        } else {
          console.log(data);
          resolve(data);
        }
      });
    }).then(keys => keys.map(key => lodash(key.toJSON()).omitBy(lodash.isUndefined).value()));

  };
  const calculateReport = (dataModel, reportDate, key) => {
    const collection = dataModel.getDataSource().connector.collection(dataModel.modelName);
    const reportTypes = ['os', 'device', 'gender', 'age', 'income'];
    const matchConditions = lodash.extend({}, key, {
      createdAt: {$gte: moment(reportDate).startOf('day').toDate(), $lte: moment(reportDate).endOf('day').toDate()}
    });

    let reports = {};

    return Promise
      .map(reportTypes, type => {
        return new Promise((resolve, reject) => {
          collection.aggregate([{
            $match: matchConditions
          }, {
            $group: {
              _id: `$${type}`,
              count: { $sum: 1 }
            }
          }], (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        }).then(report => {
          const reportKey = `report${type[0].toUpperCase() + type.slice(1)}`;
          reports[reportKey] = {};
          report.forEach(row => { reports[reportKey][row._id] = row.count; });
        });
      })
      .then(() => reports);
  };
  const insertReport = (reportModel, key, report) => {
    return reportModel
      .destroyAll(key)
      .then(() => reportModel.create(lodash.extend({}, key, report)));
  };

  const createReport = (keyModel, keyFields, dataModel, reportMode, reportDate) => {
    return getKeysByDate(keyModel, keyFields, reportDate)
      .then(keys => Promise.each(keys, key => {
        return calculateReport(dataModel, reportDate, key)
          .then(reports => insertReport(reportMode, lodash.extend({}, key, {reportDate: reportDate}), reports))
          .then(debug);
      }))
      .catch(err => {
        console.error(err);
      });
  };

  return (job, cb) => {
    let reportDate;
    if (job.attrs.data && job.attrs.data.reportDate) {
      reportDate = moment(job.attrs.data.reportDate).startOf('day');
    } else {
      reportDate = moment('2015-06-08').startOf('day');
    }
    debug('Started at', moment().toISOString(), 'for', reportDate.toISOString());

    Promise
      .each([
        [null, models.TrackingClick1, models.ReportAudience1],
        [{advertiserId: '$advertiserId'}, models.TrackingClick2, models.ReportAudience3],
        [{advertiserId: '$advertiserId', campaignId: '$campaignId'}, models.TrackingClick3, models.ReportAudience4],
        [{advertiserId: '$advertiserId', campaignId: '$campaignId', locationId: '$locationId', bannerId: '$bannerId'}, models.TrackingClick6, models.ReportAudience]
      ], ([keyFields, dataModel, reportMode]) => createReport(dataModel, keyFields, dataModel, reportMode, reportDate))
      .then(() => cb())
      .catch(err => {
        console.error(err);
        cb(err);
      });
  };
};
