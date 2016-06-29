import moment from 'moment';
import Promise from 'bluebird';

const app = require('../../server/server');
const models = app.models;
const debug = require('debug')('jobs:tracking.impression-process');

debug('Started at', moment().toISOString());

let loop;
const process = () => {
  clearTimeout(loop);
  models.TrackingImpression
    .find({
      where: {processed: 'not_yet'}, order: 'createdAt ASC', limit: 5
    })
    .then(impressions => {
      if (!impressions || !impressions.length) return;
      return Promise.each(impressions, impression => impression.updateAttribute('processed', 'processing'));
    })
    .then(impressions => {
      if (!impressions || !impressions.length) return;
      return Promise.reduce(impressions, (_, impression) => {
        debug('Process impression ID', impression.id);
        return impression.process();
      }, 0);
    })
    .then(() => {
      loop = setTimeout(process, 100);
    })
    .catch(err => {
      console.error(err);
      loop = setTimeout(process, 100);
    });
};
process();
