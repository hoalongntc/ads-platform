const app = require('../../server/server');
import Agenda from 'agenda';

const completedCampaign = require('./observer-campaign-completed');

const agenda = new Agenda({db: {address: app.datasources.mongo.settings.url}, processEvery: '10 seconds'});
agenda.on('ready', () => {
  // agenda.define('report.audience', {concurrency: 1, priority: 'normal', lockLifetime: 300}, require('./report.audience')(app));
  // agenda.every('2 hours', 'report.audience');

  agenda.define('report.location', {concurrency: 1, priority: 'normal', lockLifetime: 300}, require('./report.location')(app));
  agenda.every('10 seconds', 'report.location');

  // completedCampaign(app, agenda);
  // agenda.every('5 minutes', 'observer-campaign-completed');

  // Start
  agenda.start();
});
