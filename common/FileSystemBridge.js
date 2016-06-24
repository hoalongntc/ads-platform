import jwt from 'jsonwebtoken';
const appConfig = require('../server/server.js');
const value = appConfig.get('fileServer');
const secret = appConfig.get('fileSecret');

export default function(getUser) {
  return (req, res) => {
    let fileServer = value;
    const token = jwt.sign(getUser(), secret);
    res.redirect(`${fileServer}?token=${token}`);
  };
}

