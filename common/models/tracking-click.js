import lodash from 'lodash';
import Promise from 'bluebird';
import { getMethodArguments } from '../utils';

module.exports = function(TrackingClick) {
  /**
   * Hiding all methods
   * */
  TrackingClick.disableRemoteMethod('create', true);
  TrackingClick.disableRemoteMethod('upsert', true);
  TrackingClick.disableRemoteMethod('updateAll', true);
  TrackingClick.disableRemoteMethod('updateAttributes', false);
  TrackingClick.disableRemoteMethod('find', true);
  TrackingClick.disableRemoteMethod('findById', true);
  TrackingClick.disableRemoteMethod('findOne', true);
  TrackingClick.disableRemoteMethod('deleteById', true);
  TrackingClick.disableRemoteMethod('count', true);
  TrackingClick.disableRemoteMethod('exists', true);
  TrackingClick.disableRemoteMethod('createChangeStream', true);

  /**
   * click
   * */
  const upsertTrackingClick = (model, keys, clickOpts) => {
    const opts = lodash.cloneDeep(clickOpts);

    return model
      .findOne({where: keys})
      .then(obj => {
        if (obj) {
          for (const key in keys) {
            delete opts[key];
          }
          opts.count = (obj.count || 1) + 1;
          return obj.updateAttributes(opts);
        } else {
          // Create new
          opts.count = 1;
          return model.create(opts);
        }
      })
      .catch(err => {
        console.error(err);
        return Promise.resolve(false);
      });
  };

  TrackingClick.new = function() {
    const models = TrackingClick.app.models;
    const cb = arguments[arguments.length - 1];
    const opts = getMethodArguments(TrackingClick, 'new', true, arguments);
    const trackingClicks = [];

    // Insert to TrackingClick
    trackingClicks.push(TrackingClick.create(opts));

    // Insert to Tracking1
    if (opts.mac) {
      trackingClicks.push(upsertTrackingClick(models.TrackingClick1,
        { mac: opts.mac },
        opts));
    }

    // Insert to Tracking2
    if (opts.mac && opts.advertiserId) {
      trackingClicks.push(upsertTrackingClick(models.TrackingClick2,
        { mac: opts.mac, advertiserId: opts.advertiserId },
        opts));
    }

    // Insert to Tracking3
    if (opts.mac && opts.advertiserId && opts.campaignId) {
      trackingClicks.push(upsertTrackingClick(models.TrackingClick3,
        { mac: opts.mac,
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId
        },
        opts));
    }

    // Insert to Tracking4
    if (opts.mac && opts.advertiserId && opts.campaignId && opts.bannerId) {
      trackingClicks.push(upsertTrackingClick(models.TrackingClick4,
        { mac: opts.mac,
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          bannerId: opts.bannerId
        },
        opts));
    }

    // Insert to Tracking5
    if (opts.mac && opts.advertiserId && opts.campaignId && opts.hotspotId) {
      trackingClicks.push(upsertTrackingClick(models.TrackingClick5,
        { mac: opts.mac,
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          hotspotId: opts.hotspotId
        },
        opts));
    }

    // Insert to Tracking6
    if (opts.mac && opts.advertiserId && opts.campaignId && opts.bannerId && opts.hotspotId) {
      trackingClicks.push(upsertTrackingClick(models.TrackingClick6,
        { mac: opts.mac,
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          bannerId: opts.bannerId,
          hotspotId: opts.hotspotId
        },
        opts));
    }

    Promise
      .all(trackingClicks)
      .then(data => {
        // Update total click to Campaign ??
        cb(null, data && data[0] && data[0].id);
      })
      .catch(cb);
  };

  const clickMethodOptions = {
    description: 'Tracking a click from user',
    accepts: [
      {arg: 'mac', type: 'string', description: 'Device MAC address (required)'},
      {arg: 'advertiserId', type: 'string', description: 'Advertiser ID (required)'},
      {arg: 'advertiserName', type: 'string', description: 'Advertiser Name'},
      {arg: 'campaignId', type: 'string', description: 'Campaign ID (required)'},
      {arg: 'campaignName', type: 'string', description: 'Campaign Name'},
      {arg: 'bannerId', type: 'string', description: 'Banner ID (required)'},
      {arg: 'bannerName', type: 'string', description: 'Banner Name'},
      {arg: 'hotspotId', type: 'string', description: 'Hotspot ID (required)'},
      {arg: 'hotspotName', type: 'string', description: 'Hotspot Name'},

      // OS, Device
      {arg: 'os', type: 'string', description: 'User device`s OS'},
      {arg: 'device', type: 'string', description: 'User`s device type (mobile, tablet, laptop)'},
      {arg: 'device_model', type: 'string', description: 'User`s device model (Galaxy S7, HTC One 10,...)'},

      // Audience
      {arg: 'name', type: 'string', description: 'User`s full name'},
      {arg: 'email', type: 'string', description: 'User`s email'},
      {arg: 'gender', type: 'string', description: 'User`s gender (male|female)'},
      {arg: 'age', type: 'string', description: 'User`s age'},
      {arg: 'income', type: 'string', description: 'User`s income'},
      {arg: 'country', type: 'string', description: 'User`s nationality'},
      {arg: 'phone', type: 'string', description: 'User`s phone number'},
      {arg: 'favorite', type: 'string', description: 'User`s hobbies'},
      {arg: 'userType', type: 'string', description: 'User type (form|facebook|google)'},

      // Session
      {arg: 'startTime', type: 'date', description: 'Time when user started using internet'},
      {arg: 'stopTime', type: 'date', description: 'Time when user stopped using internet'},
      {arg: 'sessionTime', type: 'number', description: 'Session duration in second'},
      {arg: 'dataUsage', type: 'number', description: 'Total data uploaded and downloaded in KB'},
    ],
    returns: {arg: 'clickId', type: 'string'}
  };
  TrackingClick.remoteMethod('new', lodash.extend({http: {verb: 'get'}}, clickMethodOptions));
  TrackingClick.remoteMethod('new', clickMethodOptions);

  /**
   * Remote hook: normalize options
   * */
};
