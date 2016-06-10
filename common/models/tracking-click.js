module.exports = function(TrackingClick) {
  const lodash = require('lodash');

  TrackingClick.click = (mac, cb) => {
    cb(null, null);
    // Insert to TrackingClick
    // Insert to Tracking1
    // Insert to Tracking2
    // Insert to Tracking3
    // Insert to Tracking4
    // Insert to Tracking5
    // Insert to Tracking6

    // Update total click to Campaign ??

  };

  const clickMethodOptions = {
    description: 'Tracking a click from user',
    accepts: [
      {arg: 'mac', type: 'string', description: 'Device MAC address'}
    ]
  };

  TrackingClick.remoteMethod('click', lodash.extend({http: {verb: 'get'}}, clickMethodOptions));
  TrackingClick.remoteMethod('click', clickMethodOptions);
};
