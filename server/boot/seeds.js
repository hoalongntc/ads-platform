'use strict';

module.exports = (app) => {
  const fs = require('fs');
  const path = require('path');
  const modelDir = path.join(__dirname, '../../', 'common/models');
  const files = fs.readdirSync(modelDir);

  files.forEach((file) => {
    if (file.slice(-5) == '.json') {
      const model = require(path.join(modelDir, file));
      app.dataSources.mongo.autoupdate(model.name, (err) => {
        if (err) throw err;
      });
    }
  });
};
