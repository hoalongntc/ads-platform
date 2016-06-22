var moment =  require('moment');
var Agenda = require('agenda');

var dailyReport = require('./calculate-daily-reports')
var completedCampaign = require('./observer-campaign-completed');

export default (app) => {
  const agenda = new Agenda({db: {address: "mongodb://127.0.0.1:27017/test"}, processEvery: '30 seconds'});
  agenda.on('ready', () => {
    dailyReport(app, agenda);
    completedCampaign(app,agenda);
    agenda.every('20 seconds', 'calculate-daily-report', {reportDate: moment('2016-06-09').startOf('day').valueOf()});
    agenda.every('10 seconds', 'observer-campaign-completed');
    agenda.schedule('10 seconds', 'observer-campaign-completed');
    // Start
    agenda.start();
  });
}
