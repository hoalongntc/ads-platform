import jwt from  'jsonwebtoken'
var appConfig = require('./../server/server.js');
var value = appConfig.get('fileServer');
var serect = appConfig.get('fileSerect');


export default (getUser) => (req, res) => {
  let fileServer = value;
  var token = jwt.sign(getUser(), serect);
  res.redirect(fileServer + `?token=${token}` )
}

