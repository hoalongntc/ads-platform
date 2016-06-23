import moment from 'moment';

const app = require('../../server/server');
const models = app.models;
const debug = require('debug')('jobs:tracking.impression-process');

debug('Started at', moment().toISOString());

let loop;
const process = () => {
  clearTimeout(loop);
  models.TrackingImpression
    .findOne({
      where: {processed: 'not_yet'}, order: 'createdAt ASC'
    })
    .then(impression => {
      if (!impression) return;
      return impression.updateAttribute('processed', 'processing');
    })
    .then(impression => {
      if (!impression) return;
      debug('Process impression ID', impression.id);
      return impression.process();
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
