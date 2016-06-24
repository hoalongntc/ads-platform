import moment from 'moment';
import lodash from 'lodash';
import Promise from 'bluebird';

export default (app) => {
  const models = app.models;
  const debug = require('debug')('jobs:report.audience');

  const getKeysByDate = (keyModel, keyFields, reportDate) => {
    if (!keyModel) return Promise.resolve([{}]);
    return keyModel
      .find({
        where: {trackingDate: reportDate},
        fields: keyFields
      })
      .then(keys => keys.map(key => lodash(key.toJSON()).omitBy(lodash.isUndefined).value()));
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
      reportDate = moment().startOf('day');
    }
    debug('Started at', moment().toISOString(), 'for', reportDate.toISOString());

    Promise
      .each([
        [null, null, models.TrackingClick1, models.ReportAudience1],
        [models.TrackingImpression1, {advertiserId: 1}, models.TrackingClick2, models.ReportAudience3],
        [models.TrackingImpression2, {advertiserId: 1, campaignId: 1}, models.TrackingClick3, models.ReportAudience4],
        [models.TrackingImpression5, {advertiserId: 1, campaignId: 1, locationId: 1, bannerId: 1}, models.TrackingClick6, models.ReportAudience]
      ], ([keyModel, keyFields, dataModel, reportMode]) => createReport(keyModel, keyFields, dataModel, reportMode, reportDate))
      .then(() => cb())
      .catch(err => {
        console.error(err);
        cb(err);
      });
  };
};
