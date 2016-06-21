import jwt from 'jsonwebtoken';
const appConfig = require('./server.js');
const value = appConfig.get('fileServer');
const serect = appConfig.get('fileSerect');

export default function(getUser) {
  return (req, res) => {
    let fileServer = value;
    const token = jwt.sign(getUser(), serect);
    res.redirect(`${fileServer}?token=${token}`);
  };
}

