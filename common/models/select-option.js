'use strict';

module.exports = function(SelectOption) {
  SelectOption.cities = (cb) => {
    SelectOption.find({where: {type: 'city'}, fields: {type: 0}}, (err, response) => {
      if (err) return cb(err, null);
      cb(null, response);
    });
  };
  SelectOption.remoteMethod('cities', {
    http: {verb: 'get'},
    returns: {type: 'array', root: true}
  });

  SelectOption.campaignCategories = (cb) => {
    SelectOption.find({where: {type: 'campaign_category'}, fields: {type: 0}}, (err, response) => {
      if (err) return cb(err, null);
      cb(null, response);
    });
  };
  SelectOption.remoteMethod('campaignCategories', {
    http: {verb: 'get'},
    returns: {type: 'array', root: true}
  });

  SelectOption.hotspotCategories = (cb) => {
    SelectOption.find({where: {type: 'hotspot_category'}, fields: {type: 0}}, (err, response) => {
      if (err) return cb(err, null);
      cb(null, response);
    });
  };
  SelectOption.remoteMethod('hotspotCategories', {
    http: {verb: 'get'},
    returns: {type: 'array', root: true}
  });
};
