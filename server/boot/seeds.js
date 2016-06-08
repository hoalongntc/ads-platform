'use strict';

module.exports = (app) => {
  const fs = require('fs');
  const path = require('path');
  const Promise = require('bluebird');

  const modelDir = path.join(__dirname, '../../', 'common/models');
  const seedDataDir = path.join(__dirname, '../', 'seed_data');
  const files = fs.readdirSync(modelDir);
  const autoupdate = Promise.promisify(app.dataSources.mongo.autoupdate, {context: app.dataSources.mongo});
  const updates = [];

  files.forEach((file) => {
    if (file.slice(-5) == '.json') {
      const model = require(path.join(modelDir, file));
      updates.push(autoupdate(model.name));
    }
  });

  Promise.all(updates)
    .then(() => {
      console.log('Insert seed data');

      // SelectOption
      const findOrCreate = Promise.promisify(app.models.SelectOption.findOrCreate, {context: app.models.SelectOption});
      const selectOptions = require(path.join(seedDataDir, 'select_options.json'));
      selectOptions.map((item) => {
        return findOrCreate({where: { type: item.type, value: item.value }}, item);
      });

      return Promise.all(selectOptions)
        .then((data) => {
          console.log(data);
        });
    })
    .catch((err) => {
      throw err;
    });
};
