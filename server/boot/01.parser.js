import bodyParser from 'body-parser';

module.exports = function (app) {
  // to support JSON-encoded bodies
  app.use(bodyParser.json());

  // to support URL-encoded bodies
  app.use(bodyParser.urlencoded({
    extended: true
  }));
};
