import lodash from 'lodash';
import moment from 'moment';
import Promise from 'bluebird';
import { getMethodArguments } from '../utils';

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
    const opts = lodash.cloneDeep(imOpts);

    return Promise
      .all([
        model.findOne({where: lodash.extend(keys, {reportEpoch: null})}),
        model.findOne({where: lodash.extend(keys, {reportEpoch: moment().startOf('day').valueOf()})})
      ])
      .then(objs => {
        return Promise.all(objs.map((obj, index) => {
          if (obj) {
            for (const key in keys) {
              delete opts[key];
            }
            opts.count = (obj.count || 1) + 1;
            return obj.updateAttributes(opts);
          } else {
            // Create new
            opts.count = 1;
            opts.reportEpoch = (index == 0 ? null : moment().startOf('day').valueOf());

            return model.create(opts);
          }
        }));
      })
      .catch(err => {
        console.error(err);
        return Promise.resolve(false);
      });
  };
  TrackingImpression.new = function () {
    const models = TrackingImpression.app.models;
    const cb = arguments[arguments.length - 1];
    const opts = getMethodArguments(TrackingImpression, 'new', true, arguments);
    const trackingImpressions = [];

    if (opts.mac && opts.advertiserId && opts.campaignId && opts.bannerId && opts.hotspotId) {
      trackingImpressions.push(upsertTrackingImpression(TrackingImpression,
        { mac: opts.mac,
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          bannerId: opts.bannerId,
          hotspotId: opts.hotspotId
        },
        opts
      ));
    }

    if (opts.mac) {
      trackingImpressions.push(upsertTrackingImpression(models.TrackingImpression1,
        { mac: opts.mac },
        opts
      ));
    }

    if (opts.mac && opts.advertiserId) {
      trackingImpressions.push(upsertTrackingImpression(models.TrackingImpression2,
        { mac: opts.mac,
          advertiserId: opts.advertiserId
        },
        opts
      ));
    }

    if (opts.mac && opts.advertiserId && opts.campaignId) {
      trackingImpressions.push(upsertTrackingImpression(models.TrackingImpression3,
        { mac: opts.mac,
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId
        },
        opts
      ));
    }

    if (opts.mac && opts.advertiserId && opts.campaignId && opts.bannerId) {
      trackingImpressions.push(upsertTrackingImpression(models.TrackingImpression4,
        { mac: opts.mac,
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          bannerId: opts.bannerId
        },
        opts
      ));
    }

    if (opts.mac && opts.advertiserId && opts.campaignId && opts.hotspotId) {
      trackingImpressions.push(upsertTrackingImpression(models.TrackingImpression5,
        { mac: opts.mac,
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          hotspotId: opts.hotspotId
        },
        opts
      ));
    }

    Promise
      .all(trackingImpressions)
      .then(data => {
        cb(null, data && data[0] && data[0][0] && data[0][0].count);
      })
      .catch(cb);
  };

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
      {arg: 'hotspotId', type: 'string', description: 'Hotspot ID (required)'},
      {arg: 'hotspotName', type: 'string', description: 'Hotspot Name'}
    ],
    returns: {arg: 'impressCount', type: 'number'}
  };
  TrackingImpression.remoteMethod('new', lodash.extend({http: {verb: 'get'}}, impressMethodOptions));
  TrackingImpression.remoteMethod('new', impressMethodOptions);
};
