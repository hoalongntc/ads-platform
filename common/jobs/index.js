import moment from 'moment';
import app from '../../server/server';
import Agenda from 'agenda';

const agenda = new Agenda({db: {address: app.datasources.mongo.settings.url}});
agenda.processEvery('10 seconds');

agenda.on('ready', () => {
  agenda.define('calculate-daily-report', {concurrency: 1, priority: 'normal'}, require('./report.audidence.js')(app));
  agenda.every('20 seconds', 'calculate-daily-report', {reportDate: moment('2016-06-09').startOf('day').valueOf()});

  // Start
  agenda.start();
});
