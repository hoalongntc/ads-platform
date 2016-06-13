'use strict';

module.exports = (app, cb) => {
  const path = require('path');
  const Promise = require('bluebird');

  const seedDataDir = path.join(__dirname, '../', 'seed_data');
  const autoupdate = Promise.promisify(app.dataSources.mongo.autoupdate, {context: app.dataSources.mongo});

  autoupdate()
    .then(() => {
      // SelectOption
      const findOrCreate = Promise.promisify(app.models.SelectOption.findOrCreate, {context: app.models.SelectOption});
      const selectOptions = require(path.join(seedDataDir, 'select_options.json'));
      selectOptions.map((item) => {
        return findOrCreate({where: { type: item.type, value: item.value }}, item);
      });

      return Promise.all(selectOptions);
    })
    .then(() => {
      cb();
    })
    .catch(err => {
      console.log(err);
      cb();
    });
};
