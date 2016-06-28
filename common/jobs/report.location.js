import moment from 'moment';

export default (app) => {
  const {Campaign} = app.models;
  const debug = require('debug')('jobs:report.location');

  const calculateReport = (campaign, result) => {
    debug(campaign);

    if (campaign.locations && Array.isArray(campaign.locations)) {
      campaign.locations.forEach((location) => {
        result.locations[location.locationId] = (result.locations[location.locationId] || 0) + 1;
        result.cities[location.cityId] = (result.cities[location.cityId] || 0) + 1;
        result.categories[location.categoryId] = (result.categories[location.categoryId] || 0) + 1;
      });
    }
  };

  const processTopBefore = (beforeDate, offset = 0, result) => {
    if (!beforeDate) {
      beforeDate = moment();
    }

    return Campaign
      .find({
        where: {createdAt: {lte: beforeDate}}, order: 'createdAt ASC', limit: 50, offset: offset
      })
      .then(campaigns => {
        campaigns.forEach(campaign => calculateReport(campaign, result));
        return campaigns.length;
      })
      .then(length => {
        if (length) {
          return processTopBefore(beforeDate, offset + 50, result);
        }
        else {
          return result;
        }
      });
  };

  return (job, cb) => {
    debug('Started at', moment().toISOString());

    let result = { locations: {}, cities: {}, categories: {} };
    processTopBefore(moment(), 0, result)
      .then(() => {
        debug(result);
        cb();
      })
      .catch(err => {
        debug(err);
        cb(err);
      });
  };
};
