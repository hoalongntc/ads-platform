const app = require('../server/server');

app.dataSources.mongo.automigrate(err => {
  if (err) return console.log(err);
  console.log('Drop and recreate tables finished.');

  // DB seed
  const selectOptions = require('./seed/select_options');
  const trackingData = require('./seed/tracking');
  const authentication = require('./seed/authentication');

  selectOptions(app)
    .then(() => authentication(app))
    .then(() => {
      console.log('Done');
      process.exit(0);
    })
});
