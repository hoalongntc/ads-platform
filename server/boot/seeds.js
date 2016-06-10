'use strict';

module.exports = (app, cb) => {
  const fs = require('fs');
  const path = require('path');
  const Promise = require('bluebird');

  const modelDir = path.join(__dirname, '../../', 'common/models');
  const seedDataDir = path.join(__dirname, '../', 'seed_data');
  const autoupdate = Promise.promisify(app.dataSources.mongo.autoupdate, {context: app.dataSources.mongo});
  const files = fs.readdirSync(modelDir);
  const models = [];

  files.forEach((file) => {
    if (file.slice(-5) == '.json') {
      const model = require(path.join(modelDir, file));
      models.push(model.name);
    }
  });

  autoupdate(models)
    .then(() => {
      // SelectOption
      const findOrCreate = Promise.promisify(app.models.SelectOption.findOrCreate, {context: app.models.SelectOption});
      const selectOptions = require(path.join(seedDataDir, 'select_options.json'));
      selectOptions.map((item) => {
        return findOrCreate({where: { type: item.type, value: item.value }}, item);
      });

      return Promise.all(selectOptions);
    })
    .then(() => {
      const create = Promise.promisify(app.models.TrackingClick.create, {context: app.models.TrackingClick});
      return create({
        mac: 'AC:AC:AC:AC:AC:AC',
        advertiserId: 1, advertiserName: 'defaultAdvertiser',
        campaignId: 1, campaignName: 'defaultCampaign',
        bannerId: 1, bannerName: 'defaultBanner',
        hotspotId: 1, hotspotName: 'defaultHotspot'
      });
    })
    .then(() => {
      const findOrCreate = Promise.promisify(app.models.Tracking1.findOrCreate, {context: app.models.Tracking1});
      return findOrCreate({where: {
        mac: 'AC:AC:AC:AC:AC:AC'
      }}, {
        mac: 'AC:AC:AC:AC:AC:AC'
      });
    })
    .then(() => {
      const findOrCreate = Promise.promisify(app.models.Tracking2.findOrCreate, {context: app.models.Tracking2});
      return findOrCreate({where: {
        mac: 'AC:AC:AC:AC:AC:AC',
        advertiserId: 1
      }}, {
        mac: 'AC:AC:AC:AC:AC:AC',
        advertiserId: 1, advertiserName: 'defaultAdvertiser'
      });
    })
    .then(() => {
      const findOrCreate = Promise.promisify(app.models.Tracking3.findOrCreate, {context: app.models.Tracking3});
      return findOrCreate({where: {
        mac: 'AC:AC:AC:AC:AC:AC',
        advertiserId: 1,
        campaignId: 1
      }}, {
        mac: 'AC:AC:AC:AC:AC:AC',
        advertiserId: 1, advertiserName: 'defaultAdvertiser',
        campaignId: 1, campaignName: 'defaultCampaign'
      });
    })
    .then(() => {
      const findOrCreate = Promise.promisify(app.models.Tracking4.findOrCreate, {context: app.models.Tracking4});
      return findOrCreate({where: {
        mac: 'AC:AC:AC:AC:AC:AC',
        advertiserId: 1,
        campaignId: 1,
        bannerId: 1
      }}, {
        mac: 'AC:AC:AC:AC:AC:AC',
        advertiserId: 1, advertiserName: 'defaultAdvertiser',
        campaignId: 1, campaignName: 'defaultCampaign',
        bannerId: 1, bannerName: 'defaultBanner'
      });
    })
    .then(() => {
      const findOrCreate = Promise.promisify(app.models.Tracking5.findOrCreate, {context: app.models.Tracking5});
      return findOrCreate({where: {
        mac: 'AC:AC:AC:AC:AC:AC',
        advertiserId: 1,
        campaignId: 1,
        hotspotId: 1
      }}, {
        mac: 'AC:AC:AC:AC:AC:AC',
        advertiserId: 1, advertiserName: 'defaultAdvertiser',
        campaignId: 1, campaignName: 'defaultCampaign',
        hotspotId: 1, hotspotName: 'defaultHotspot'
      });
    })
    .then(() => {
      const findOrCreate = Promise.promisify(app.models.Tracking6.findOrCreate, {context: app.models.Tracking6});
      return findOrCreate({where: {
        mac: 'AC:AC:AC:AC:AC:AC',
        advertiserId: 1,
        campaignId: 1,
        bannerId: 1,
        hotspotId: 1
      }}, {
        mac: 'AC:AC:AC:AC:AC:AC',
        advertiserId: 1, advertiserName: 'defaultAdvertiser',
        campaignId: 1, campaignName: 'defaultCampaign',
        bannerId: 1, bannerName: 'defaultBanner',
        hotspotId: 1, hotspotName: 'defaultHotspot'
      });
    })
    .then(() => {
      cb();
    })
    .catch((err) => {
      throw err;
    });
};
