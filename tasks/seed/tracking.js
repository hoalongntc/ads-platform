import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import {standardizeMacAddress, standardizeGender, standardizeAgeAndIncome, standardizeOs, standardizeDevice} from '../../common/utils';

export default function(app) {
  'use strict';

  const insertRow = (row) => {
    const args = {};
    args.mac = standardizeMacAddress(row.mac);
    args.advertiserId = row.customer_id;
    args.campaignId = row.campaign_id;
    args.bannerId = row.banner_id;
    args.locationId = row.site_id;
    args.os = standardizeOs(row.os);
    args.device = standardizeDevice(row.device);
    args.device_model = row.model;
    args.name = row.name;
    args.email = row.email;
    args.gender = standardizeGender(row.gender);
    args.age = standardizeAgeAndIncome(row.survey01);
    args.income = standardizeAgeAndIncome(row.survey02);
    args.phone = row.phone;
    args.userType = row.user_type;
    args.createdAt = row.created_at;
    args.updatedAt = row.updated_at;

    const arg2s = {};
    arg2s.mac = standardizeMacAddress(row.mac);
    arg2s.advertiserId = row.customer_id;
    arg2s.campaignId = row.campaign_id;
    arg2s.bannerId = row.banner_id;
    arg2s.locationId = row.site_id;
    arg2s.os = standardizeOs(row.os);
    arg2s.device = standardizeDevice(row.device);
    arg2s.device_model = row.model;
    arg2s.createdAt = row.created_at;
    arg2s.updatedAt = row.updated_at;

    return Promise.all([
      app.models.TrackingClick.import(args),
      app.models.TrackingImpression.import(arg2s)
    ]);
  };
  const importTracking = (file) => {
    console.log(`Importing ${file}...`);
    const readFile = Promise.promisify(fs.readFile, {context: fs});
    return readFile(file, 'utf8')
      .then(content => {
        const oldTrackingData = JSON.parse(content);
        return Promise.each(oldTrackingData, insertRow);
      });
  };

  return Promise.each([1, 2, 3], num => importTracking(path.join(__dirname, `./tracking${num}.json`)))
    .then(() => cb())
    .catch(err => {
      console.log(err);
      cb();
    });
}
