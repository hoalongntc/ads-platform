import lodash from 'lodash';
import moment from 'moment';
import Promise from 'bluebird';
import {getMethodArguments, standardizeMacAddress, standardizeGender} from '../utils';

module.exports = function (TrackingClick) {
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
  const upsertTracking = (model, keys, clickOpts, countField = 'count') => {
    const opts = lodash.cloneDeep(clickOpts);

    return model
      .findOne({where: keys})
      .then(obj => {
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
      });
  };

  TrackingClick.prototype.process = function () {
    const models = TrackingClick.app.models;
    const trackingClicks = [];

    const opts = lodash(this.toJSON()).omitBy(lodash.isUndefined).value();
    const reportDate = moment(opts.createdAt).startOf('day');
    delete opts.id;
    delete opts.createdAt;
    delete opts.updatedAt;
    delete opts.count;

    opts.reportDate = reportDate;
    // Insert to Tracking1
    if (opts.mac) {
      trackingClicks.push(upsertTracking(models.TrackingClick1,
        {mac: opts.mac},
        opts));
    }

    // Insert to Tracking2
    if (opts.mac && opts.advertiserId) {
      trackingClicks.push(upsertTracking(models.TrackingClick2,
        {mac: opts.mac, advertiserId: opts.advertiserId},
        opts));
    }

    // Insert to Tracking3
    if (opts.mac && opts.advertiserId && opts.campaignId) {
      trackingClicks.push(upsertTracking(models.TrackingClick3,
        {
          mac: opts.mac,
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId
        },
        opts));
    }

    // Insert to Tracking4
    if (opts.mac && opts.advertiserId && opts.campaignId && opts.bannerId) {
      trackingClicks.push(upsertTracking(models.TrackingClick4,
        {
          mac: opts.mac,
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          bannerId: opts.bannerId
        },
        opts));
    }

    // Insert to Tracking5
    if (opts.mac && opts.advertiserId && opts.campaignId && opts.locationId) {
      trackingClicks.push(upsertTracking(models.TrackingClick5,
        {
          mac: opts.mac,
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          locationId: opts.locationId
        },
        opts));
    }

    // Insert to Tracking6
    if (opts.mac && opts.advertiserId && opts.campaignId && opts.bannerId && opts.locationId) {
      trackingClicks.push(upsertTracking(models.TrackingClick6,
        {
          mac: opts.mac,
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          bannerId: opts.bannerId,
          locationId: opts.locationId
        },
        opts));
    }

    // Insert to Tracking7
    if (opts.mac && opts.locationId) {
      trackingClicks.push(upsertTracking(models.TrackingClick7,
        {
          mac: opts.mac,
          locationId: opts.locationId
        },
        opts));
    }

    // Update ReportTracking1
    if (opts.advertiserId && opts.campaignId) {
      trackingClicks.push(upsertTracking(models.ReportTracking1,
        {
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          reportDate: reportDate
        },
        opts, 'clickCount'));
    }

    // Update ReportTracking3
    if (opts.advertiserId && opts.campaignId && opts.locationId) {
      trackingClicks.push(upsertTracking(models.ReportTracking2,
        {
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          locationId: opts.locationId,
          reportDate: reportDate
        },
        opts, 'clickCount'));
    }

    // Update ReportTracking3
    if (opts.advertiserId && opts.campaignId && opts.bannerId) {
      trackingClicks.push(upsertTracking(models.ReportTracking3,
        {
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          bannerId: opts.bannerId,
          reportDate: reportDate
        },
        opts, 'clickCount'));
    }

    // Update ReportTracking4
    if (opts.advertiserId && opts.campaignId && opts.locationId && opts.bannerId) {
      trackingClicks.push(upsertTracking(models.ReportTracking4,
        {
          advertiserId: opts.advertiserId,
          campaignId: opts.campaignId,
          locationId: opts.locationId,
          bannerId: opts.bannerId,
          reportDate: reportDate
        },
        opts, 'clickCount'));
    }

    // Update ReportTracking5
    if (opts.advertiserId && opts.locationId) {
      trackingClicks.push(upsertTracking(models.ReportTracking5,
        {
          advertiserId: opts.advertiserId,
          locationId: opts.locationId,
          reportDate: reportDate
        },
        opts, 'clickCount'));
    }

    return Promise
      .all(trackingClicks)
      .then(() => {
        this.updateAttributes({'processed': 'success'});
      })
      .catch(err => {
        console.error(err);
        this.updateAttributes({'processed': 'failed'});
      });
  };

  TrackingClick.import = function(opts) {
    return TrackingClick.create(opts);
  };
  TrackingClick.new = function() {
    const cb = arguments[arguments.length - 1];
    const opts = getMethodArguments(TrackingClick, 'new', true, arguments);

    return TrackingClick
      .create(opts)
      .then(data => {
        cb(null, data.id);
      })
      .catch(cb);
  };
  TrackingClick.newPost = TrackingClick.new;

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
      {arg: 'locationId', type: 'string', description: 'Hotspot ID (required)'},
      {arg: 'locationName', type: 'string', description: 'Hotspot Name'},

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
  TrackingClick.remoteMethod('new', lodash.extend({http: {verb: 'get', path: '/'}}, clickMethodOptions));
  TrackingClick.remoteMethod('newPost', lodash.extend({http: {path: '/'}}, clickMethodOptions));
  TrackingClick.observe('before save', (ctx, next) => {
    if (ctx.instance) {
      if (ctx.instance.mac) {
        ctx.instance.mac = standardizeMacAddress(ctx.instance.mac);
      }
      if (ctx.instance.gender) {
        ctx.instance.gender = standardizeGender(ctx.instance.gender);
      }
    } else {
      if (ctx.data.mac) {
        ctx.data.mac = standardizeMacAddress(ctx.data.mac);
      }
      if (ctx.data.gender) {
        ctx.data.gender = standardizeGender(ctx.data.gender);
      }
    }

    next();
  });
};
