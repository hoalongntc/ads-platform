'use strict';

import fileSystemBridge from '../FileSystemBridge';
module.exports = function (server) {
  // Install a `/` route that returns server status
  const router = server.loopback.Router();
  router.get('/status', server.loopback.status());
  router.get('/FileSystem', fileSystemBridge(() => ({userName: 'cthanhnguyen'})));
  router.post('/FileSystem', fileSystemBridge(() => ({userName: 'cthanhnguyen'})));
  server.use(router);
};
