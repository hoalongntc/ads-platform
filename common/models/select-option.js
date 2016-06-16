'use strict';

module.exports = function(SelectOption) {
  /**
   * Hiding all methods
   * */
  SelectOption.disableRemoteMethod('create', true);
  SelectOption.disableRemoteMethod('upsert', true);
  SelectOption.disableRemoteMethod('updateAll', true);
  SelectOption.disableRemoteMethod('updateAttributes', false);
  SelectOption.disableRemoteMethod('find', true);
  SelectOption.disableRemoteMethod('findById', true);
  SelectOption.disableRemoteMethod('findOne', true);
  SelectOption.disableRemoteMethod('deleteById', true);
  SelectOption.disableRemoteMethod('count', true);
  SelectOption.disableRemoteMethod('exists', true);
  SelectOption.disableRemoteMethod('createChangeStream', true);

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
    http: {verb: 'get', path: '/campaigns/categories'},
    returns: {type: 'array', root: true}
  });

  SelectOption.locationCategories = (cb) => {
    SelectOption.find({where: {type: 'location_category'}, fields: {type: 0}}, (err, response) => {
      if (err) return cb(err, null);
      cb(null, response);
    });
  };
  SelectOption.remoteMethod('locationCategories', {
    http: {verb: 'get', path: '/locations/categories'},
    returns: {type: 'array', root: true}
  });
};
