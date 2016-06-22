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

  const upsertTrackingImpression = (model, keys, imOpts) => {
    return Promise
      .all([
        model.findOne({where: lodash.extend({}, keys, {trackingDate: null})}),
        model.findOne({where: keys})
      ])
      .then(objs => {
        return Promise.all(objs.map((obj, index) => {
          const opts = lodash.cloneDeep(imOpts);
          if (obj) {
            for (const key in keys) {
              delete opts[key];
            }
            opts.count = (obj.count || 1) + 1;
            return obj.updateAttributes(opts);
          } else {
            // Create new
            opts.count = 1;
            opts.trackingDate = (index == 0 ? null : keys.trackingDate);
            return model.create(opts);
          }
        }));
      })
      .catch(err => {
        console.error(err);
        return Promise.resolve(false);
      });
  };
  TrackingImpression.newWithOptions = function (trackingDate, opts, cb) {
    const models = TrackingImpression.app.models;
    const trackingImpressions = [];

    if (opts.mac && opts.advertiserId && opts.campaignId && opts.bannerId && opts.locationId) {
      trackingImpressions.push(upsertTrackingImpression(TrackingImpression,
        {
          mac: opts.mac,
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          bannerId: opts.bannerId,
          locationId: opts.locationId,
          trackingDate: trackingDate
        },
        opts
      ));
    }

    if (opts.advertiserId) {
      trackingImpressions.push(upsertTrackingImpression(models.TrackingImpression1,
        {
          advertiserId: opts.advertiserId,
          trackingDate: trackingDate
        },
        opts
      ));
    }

    if (opts.advertiserId && opts.campaignId) {
      trackingImpressions.push(upsertTrackingImpression(models.TrackingImpression2,
        {
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          trackingDate: trackingDate
        },
        opts
      ));
    }

    if (opts.advertiserId && opts.campaignId && opts.bannerId) {
      trackingImpressions.push(upsertTrackingImpression(models.TrackingImpression3,
        {
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          bannerId: opts.bannerId,
          trackingDate: trackingDate
        },
        opts
      ));
    }

    if (opts.advertiserId && opts.campaignId && opts.locationId) {
      trackingImpressions.push(upsertTrackingImpression(models.TrackingImpression4,
        {
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          locationId: opts.locationId,
          trackingDate: trackingDate
        },
        opts
      ));
    }

    if (opts.advertiserId && opts.campaignId && opts.bannerId && opts.locationId) {
      trackingImpressions.push(upsertTrackingImpression(models.TrackingImpression5,
        {
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          bannerId: opts.bannerId,
          locationId: opts.locationId,
          trackingDate: trackingDate
        },
        opts
      ));
    }

    Promise
      .all(trackingImpressions)
      .then(data => cb(null, data && data[5] && data[5][0] && data[5][0].count))
      .catch(cb);
  };

  TrackingImpression.new = function() {
    const cb = arguments[arguments.length - 1];
    const opts = getMethodArguments(TrackingImpression, 'new', true, arguments);
    return TrackingImpression.newWithOptions(moment().startOf('day'), opts, cb);
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
  TrackingImpression.remoteMethod('new', lodash.extend({http: {verb: 'get'}}, impressMethodOptions));
  TrackingImpression.remoteMethod('newPost', lodash.extend({http: {path: '/'}}, impressMethodOptions));
  TrackingImpression.beforeRemote('new*', (ctx, unused, next) => {
    ctx.args.mac = standardizeMacAddress(ctx.args.mac);
    ctx.args.gender = standardizeGender(ctx.args.gender);
    ctx.args.os = standardizeOs(ctx.args.os);
    ctx.args.device = standardizeDevice(ctx.args.device);
    next();
  });
};
