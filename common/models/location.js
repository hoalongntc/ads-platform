import { accessifyResource } from '../access-utils';

module.exports = function(Location) {
  Location.allow = (groupName, context) => {
    const models = Location.app.models;
    return groupName == models.Group.ADVERTISER;
  };

  accessifyResource(Location, 'LOCATION');
};
