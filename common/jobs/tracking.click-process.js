import moment from 'moment';

const app = require('../../server/server');
const models = app.models;
const debug = require('debug')('jobs:tracking.click-process');

debug('Started at', moment().toISOString());

let loop;
const process = () => {
  clearTimeout(loop);
  models.TrackingClick
    .findOne({
      where: {processed: 'not_yet'}, order: 'createdAt ASC'
    })
    .then(click => {
      if (!click) return;
      return click.updateAttribute('processed', 'processing');
    })
    .then(click => {
      if (!click) return;
      debug('Process click ID', click.id);
      return click.process();
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
