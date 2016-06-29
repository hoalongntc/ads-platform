import lodash from 'lodash';
import moment from 'moment';
import Promise from 'bluebird';
import { getMethodArguments, standardizeMacAddress, standardizeGender, standardizeOs, standardizeDevice } from '../utils';

module.exports = function(TrackingImpression) {

  /**
   * Hiding all methods
   * */
  TrackingImpression.disableRemoteMethod('create', true);
  TrackingImpression.disableRemoteMethod('upsert', true);
  TrackingImpression.disableRemoteMethod('updateAll', true);
  TrackingImpression.disableRemoteMethod('updateAttributes', false);
  TrackingImpression.disableRemoteMethod('find', true);
  TrackingImpression.disableRemoteMethod('findById', true);
  TrackingImpression.disableRemoteMethod('findOne', true);
  TrackingImpression.disableRemoteMethod('deleteById', true);
  TrackingImpression.disableRemoteMethod('count', true);
  TrackingImpression.disableRemoteMethod('exists', true);
  TrackingImpression.disableRemoteMethod('createChangeStream', true);

  const upsertTrackingImpression = (model, keys, imOpts, countField = 'count') => {
    return model
      .findOne({where: keys})
      .then(obj => {
        const opts = lodash.cloneDeep(imOpts);
        if (obj) {
          for (const key in keys) {
            delete opts[key];
          }
          opts[countField] = (obj[countField] || 1) + 1;
          return obj.updateAttributes(opts);
        } else {
          // Create new
          opts[countField] = 1;
          return model.create(opts);
        }
      })
      .catch(err => {
        console.error(err);
        return Promise.resolve(false);
      });
  };

  TrackingImpression.prototype.process = function () {
    const models = TrackingImpression.app.models;
    const impressionReports = [];

    const opts = lodash(this.toJSON()).omitBy(lodash.isUndefined).value();
    const reportDate = moment(opts.createdAt).startOf('day');
    delete opts.id;
    delete opts.count;

    opts.reportDate = reportDate;

    if (opts.advertiserId && opts.campaignId) {
      impressionReports.push(upsertTrackingImpression(models.ReportTracking1,
        {
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          reportDate: reportDate
        },
        opts, 'impressionCount'
      ));
    }

    if (opts.advertiserId && opts.campaignId && opts.locationId) {
      impressionReports.push(upsertTrackingImpression(models.ReportTracking2,
        {
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          locationId: opts.locationId,
          reportDate: reportDate
        },
        opts, 'impressionCount'
      ));
    }

    if (opts.advertiserId && opts.campaignId && opts.bannerId) {
      impressionReports.push(upsertTrackingImpression(models.ReportTracking3,
        {
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          bannerId: opts.bannerId,
          reportDate: reportDate
        },
        opts, 'impressionCount'
      ));
    }

    if (opts.advertiserId && opts.campaignId && opts.bannerId && opts.locationId) {
      impressionReports.push(upsertTrackingImpression(models.ReportTracking4,
        {
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          bannerId: opts.bannerId,
          locationId: opts.locationId,
          reportDate: reportDate
        },
        opts, 'impressionCount'
      ));
    }

    if (opts.advertiserId && opts.locationId) {
      impressionReports.push(upsertTrackingImpression(models.ReportTracking5,
        {
          advertiserId: opts.advertiserId,
          locationId: opts.locationId,
          reportDate: reportDate
        },
        opts, 'impressionCount'
      ));
    }

    return Promise
      .all(impressionReports)
      .then(() => {
        this.updateAttributes({'processed': 'success'});
      })
      .catch(err => {
        console.error(err);
        this.updateAttributes({'processed': 'failed'});
      });

  };

  TrackingImpression.import = function(opts) {
    return TrackingImpression.create(opts);
  };
  TrackingImpression.new = function() {
    const cb = arguments[arguments.length - 1];
    const opts = getMethodArguments(TrackingImpression, 'new', true, arguments);
    opts.processed = 'not_yet';

    return upsertTrackingImpression(TrackingImpression, {
      mac: opts.mac,
      advertiserId: opts.advertiserId,
      campaignId: opts.campaignId,
      bannerId: opts.bannerId,
      locationId: opts.locationId
    }, opts)
    .then(data => cb(null, data.count))
    .catch(cb);
  };
  TrackingImpression.newPost = TrackingImpression.new;

  const impressMethodOptions = {
    description: 'Tracking an impress from user',
    accepts: [
      {arg: 'mac', type: 'string', description: 'Device MAC address (required)'},
      {arg: 'advertiserId', type: 'string', description: 'Advertiser ID (required)'},
      {arg: 'advertiserName', type: 'string', description: 'Advertiser Name'},
      {arg: 'campaignId', type: 'string', description: 'Campaign ID (required)'},
      {arg: 'campaignName', type: 'string', description: 'Campaign Name'},
      {arg: 'bannerId', type: 'string', description: 'Banner ID (required)'},
      {arg: 'bannerName', type: 'string', description: 'Banner Name'},
      {arg: 'locationId', type: 'string', description: 'Hotspot ID (required)'},
      {arg: 'locationName', type: 'string', description: 'Hotspot Name'}
    ],
    returns: {arg: 'impressCount', type: 'number'}
  };
  TrackingImpression.remoteMethod('new', lodash.extend({http: {verb: 'get', path: '/'}}, impressMethodOptions));
  TrackingImpression.remoteMethod('newPost', lodash.extend({http: {path: '/'}}, impressMethodOptions));
  TrackingImpression.beforeRemote('new*', (ctx, unused, next) => {
    ctx.args.mac = standardizeMacAddress(ctx.args.mac);
    ctx.args.gender = standardizeGender(ctx.args.gender);
    ctx.args.os = standardizeOs(ctx.args.os);
    ctx.args.device = standardizeDevice(ctx.args.device);
    next();
  });
};
