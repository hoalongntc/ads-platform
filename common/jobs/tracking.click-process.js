import moment from 'moment';
import Promise from 'bluebird';

const app = require('../../server/server');
const models = app.models;
const debug = require('debug')('jobs:tracking.click-process');

debug('Started at', moment().toISOString());

let loop;
const process = () => {
  clearTimeout(loop);
  models.TrackingClick
    .find({
      where: {processed: 'not_yet'}, order: 'createdAt ASC', limit: 5
    })
    .then(clicks => {
      if (!clicks || !clicks.length) return;
      return Promise.each(clicks, click => click.updateAttribute('processed', 'processing'));
    })
    .then(clicks => {
      if (!clicks || !clicks.length) return;
      return Promise.reduce(clicks, (_, click) => {
        debug('Process click ID', click.id);
        return click.process();
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
