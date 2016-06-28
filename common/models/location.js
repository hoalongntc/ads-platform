import { accessifyResource } from '../access-utils';

module.exports = function(Location) {
  Location.allow = (profileName, context) => {
    const {Profile} = Location.app.models;
    return profileName == Profile.ADVERTISER;
  };

  accessifyResource(Location, 'LOCATION');
};
