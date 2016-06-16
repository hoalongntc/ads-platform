const app = require('../server/server');

app.dataSources.mongo.automigrate(err => {
  if (err) return console.log(err);
  console.log('Drop and recreate tables finished.');

  // DB seed
  require('./seed/seed')(app, () => {
    console.log('Initialize data finished.');
    process.exit(0);
  });
});
