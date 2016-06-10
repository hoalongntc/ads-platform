module.exports = function(TrackingClick) {
  const lodash = require('lodash');
  const Promise = require('bluebird');

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
  const upsertTrackingClick = (model, keys, clickOptions) => {
    const clickOpts = lodash.cloneDeep(clickOptions);

    return model
      .findOne({where: keys})
      .then(obj => {
        if (obj) {
          for (const key in keys) {
            delete clickOpts[key];
          }
          console.log(clickOpts);
          console.log(Object.keys(clickOpts).length);
          if (Object.keys(clickOpts).length) {
            // Update attributes
            return obj.updateAttributes(clickOpts);
          } else {
            // Nothing to update
            return Promise.resolve(true);
          }
        } else {
          // Create new
          return model.create(clickOpts);
        }
      })
      .catch(err => {
        console.error(err);
        return Promise.resolve(false);
      });
  };

  TrackingClick.click = function() {
    const models = TrackingClick.app.models;
    const cb = arguments[arguments.length - 1];
    const clickOpts = getClickArguments(arguments);
    const trackingClicks = [];

    // Insert to TrackingClick
    trackingClicks.push(TrackingClick.create(clickOpts));

    // Insert to Tracking1
    if (clickOpts.mac) {
      trackingClicks.push(upsertTrackingClick(models.Tracking1,
        {mac: clickOpts.mac},
        clickOpts));
    }

    // Insert to Tracking2
    if (clickOpts.mac && clickOpts.advertiserId) {
      trackingClicks.push(upsertTrackingClick(models.Tracking2,
        {mac: clickOpts.mac, advertiserId: clickOpts.advertiserId},
        clickOpts));
    }

    // Insert to Tracking3
    if (clickOpts.mac && clickOpts.advertiserId && clickOpts.campaignId) {
      trackingClicks.push(upsertTrackingClick(models.Tracking3,
        { mac: clickOpts.mac,
          advertiserId: clickOpts.advertiserId,
          campaignId: clickOpts.campaignId
        },
        clickOpts));
    }

    // Insert to Tracking4
    if (clickOpts.mac && clickOpts.advertiserId && clickOpts.campaignId && clickOpts.bannerId) {
      trackingClicks.push(upsertTrackingClick(models.Tracking4,
        { mac: clickOpts.mac,
          advertiserId: clickOpts.advertiserId,
          campaignId: clickOpts.campaignId,
          bannerId: clickOpts.bannerId
        },
        clickOpts));
    }

    // Insert to Tracking5
    if (clickOpts.mac && clickOpts.advertiserId && clickOpts.campaignId && clickOpts.hotspotId) {
      trackingClicks.push(upsertTrackingClick(models.Tracking5,
        { mac: clickOpts.mac,
          advertiserId: clickOpts.advertiserId,
          campaignId: clickOpts.campaignId,
          hotspotId: clickOpts.hotspotId
        },
        clickOpts));
    }

    // Insert to Tracking6
    if (clickOpts.mac && clickOpts.advertiserId && clickOpts.campaignId && clickOpts.bannerId && clickOpts.hotspotId) {
      trackingClicks.push(upsertTrackingClick(models.Tracking6,
        { mac: clickOpts.mac,
          advertiserId: clickOpts.advertiserId,
          campaignId: clickOpts.campaignId,
          bannerId: clickOpts.bannerId,
          hotspotId: clickOpts.hotspotId
        },
        clickOpts));
    }

    Promise
      .all(trackingClicks)
      .then(data => {
        // Update total click to Campaign ??
        cb(null, data[0] && data[0].id);
      })
      .catch(err => cb(err));
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
  const getClickArguments = (args) => {
    const result = { };
    clickMethodOptions.accepts.forEach((arg, index) => {
      if (args[index]) result[arg.arg] = args[index];
    });

    return result;
  };

  TrackingClick.beforeRemote('*.click', (ctx, non, next) => {
    console.log(ctx);
  });

  TrackingClick.remoteMethod('click', lodash.extend({http: {verb: 'get'}}, clickMethodOptions));
  TrackingClick.remoteMethod('click', clickMethodOptions);

  /**
   * Remote hook: normalize options
   * */
};
