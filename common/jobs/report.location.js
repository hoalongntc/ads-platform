import moment from 'moment';

export default (app) => {
  const models = app.models;
  const debug = require('debug')('jobs:report.location');

  const processTopBefore = (beforeDate, offset = 0, result) => {
    if (!beforeDate) {
      beforeDate = moment();
    }
    debug('Current offset', offset);
    return models.Campaign
      .find({
        where: {createdAt: {lte: beforeDate}}, order: 'createdAt ASC', limit: 50, offset: offset
      })
      .then(campaigns => {
        campaigns.forEach(campaign => calculateReport(campaign, result));
        debug('Current result', result);
        return campaigns.length;
      })
      .then(length => {
        if (length) {
          return processTopBefore(beforeDate, offset + 50, result);
        } else {
          return result;
        }
      });
  };

  const calculateReport = (campaign, result) => {
    debug(campaign);

    if (campaign.locations && Array.isArray(campaign.locations)) {
      campaign.locations.forEach((location) => {
        result.locations[location.locationId] = (result.locations[location.locationId] || 0) + 1;
        result.cities[location.cityId] = (result.cities[location.cityId] || 0) + 1;
        result.categories[location.categoryId] = (result.categories[location.categoryId] || 0) + 1;

        const advertiserId = campaign.createdBy.toString();
        if (!result.advertisers.hasOwnProperty(advertiserId)) {
          result.advertisers[advertiserId] = {locations: {}, cities: {}, categories: {}};
        }

        result.advertisers[advertiserId].locations[location.locationId] = (result.advertisers[advertiserId].locations[location.locationId] || 0) + 1;
        result.advertisers[advertiserId].cities[location.cityId] = (result.advertisers[advertiserId].cities[location.cityId] || 0) + 1;
        result.advertisers[advertiserId].categories[location.categoryId] = (result.advertisers[advertiserId].categories[location.categoryId] || 0) + 1;
      });
    }
  };

  const saveReport = (report) => {
    // Save
    return true;
  };

  return (job, cb) => {
    debug('Started at', moment().toISOString());

    let result = {locations: {}, cities: {}, categories: {}, advertisers: {}};
    return processTopBefore(moment(), 0, result)
      .then(() => {
        debug('Final result', result);
        return saveReport(result);
      })
      .then(() => cb())
      .catch(err => {
        console.error(err);
        cb(err);
      });
  };
};
