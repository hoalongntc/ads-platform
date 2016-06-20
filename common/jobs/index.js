import moment from 'moment';
import app from '../../server/server';
import Agenda from 'agenda';

import dailyReport from './calculate-daily-reports';

const agenda = new Agenda({db: {address: app.datasources.mongo.settings.url}});
agenda.processEvery('20 seconds');

agenda.on('ready', () => {
  dailyReport(app, agenda);
  agenda.every('20 seconds', 'calculate-daily-report', {reportDate: moment('2016-06-09').startOf('day').valueOf()});

  // Start
  agenda.start();
});
