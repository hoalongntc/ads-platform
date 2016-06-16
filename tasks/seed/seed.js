import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import moment from 'moment';
import {standardizeMacAddress, standardizeGender} from '../../common/utils';

module.exports = (app, cb) => {
  'use strict';

  const findOrCreate = Promise.promisify(app.models.SelectOption.findOrCreate, {context: app.models.SelectOption});
  const selectOptions = require('./select_options.json');

  selectOptions.map((item) => {
    return findOrCreate({where: { type: item.type, value: item.value }}, item);
  });

  const insertRow = (row) => {
    const args = [];
    args.push(standardizeMacAddress(row.mac));
    args.push(row.customer_id);
    args.push(undefined);
    args.push(row.campaign_id);
    args.push(undefined);
    args.push(row.banner_id);
    args.push(undefined);
    args.push(row.site_id);
    args.push(undefined);
    args.push(row.os);
    args.push(row.device);
    args.push(row.model);

    args.push(row.name);
    args.push(row.email);
    args.push(standardizeGender(row.gender));
    args.push(undefined);
    args.push(undefined);
    args.push(undefined);
    args.push(row.phone);
    args.push(undefined);
    args.push(row.user_type);
    args.push(undefined);
    args.push(undefined);
    args.push(undefined);
    args.push(undefined);
    args.push(moment(row.created_at).startOf('day'));
    args.push((err, data) => {});

    const arg2s = [];
    arg2s.push(standardizeMacAddress(row.mac));
    arg2s.push(row.customer_id);
    arg2s.push(undefined);
    arg2s.push(row.campaign_id);
    arg2s.push(undefined);
    arg2s.push(row.banner_id);
    arg2s.push(undefined);
    arg2s.push(row.site_id);
    arg2s.push(undefined);
    arg2s.push(row.os);
    arg2s.push(row.device);
    arg2s.push(row.model);
    arg2s.push(moment(row.created_at).startOf('day'));
    arg2s.push((err, data) => {});

    return Promise.all([
      app.models.TrackingClick.newWithDate.apply(app.models.TrackingClick, args),
      app.models.TrackingImpression.newWithDate.apply(app.models.TrackingImpression, arg2s)
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

  Promise
    .all(selectOptions)
    .then(() => Promise.each([1, 2, 3], num => importTracking(path.join(__dirname, `./tracking${num}.json`))))
    .then(() => cb())
    .catch(err => {
      console.log(err);
      cb();
    });
};
