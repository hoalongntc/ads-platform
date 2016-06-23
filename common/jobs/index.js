import moment from 'moment';
import app from '../../server/server';
import Agenda from 'agenda';

const agenda = new Agenda({db: {address: app.datasources.mongo.settings.url}});
agenda.processEvery('10 seconds');

agenda.on('ready', () => {
  agenda.define('report.audience', {concurrency: 1, priority: 'normal', lockLifetime: 300}, require('./report.audience.js')(app));
  agenda.every('20 seconds', 'report.audience');
  
  // Start
  agenda.start();
});
