const app = require('../../server/server');
import Agenda from 'agenda';

const completedCampaign = require('./observer-campaign-completed');

const agenda = new Agenda({db: {address: app.datasources.mongo.settings.url}, processEvery: '10 seconds'});
agenda.on('ready', () => {
  agenda.define('report.audience', {concurrency: 1, priority: 'normal', lockLifetime: 300}, require('./report.audience.js')(app));
  agenda.every('20 seconds', 'report.audience');
  
  completedCampaign(app, agenda);
  agenda.every('10 seconds', 'observer-campaign-completed');
  agenda.schedule('10 seconds', 'observer-campaign-completed');

  // Start
  agenda.start();
});
