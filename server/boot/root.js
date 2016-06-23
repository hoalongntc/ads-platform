'use strict';

import fileSystemBridge from '../../common/FileSystemBridge';
import RedisService from '../../common/RedisService';
module.exports = function (server) {
  // Install a `/` route that returns server status
  const router = server.loopback.Router();
  RedisService.initRedisService();
  router.get('/status', server.loopback.status());
  router.get('/FileSystem', fileSystemBridge(() => ({userName: 'cthanhnguyen', role: 'user'})));
  router.post('/FileSystem', fileSystemBridge(() => ({userName: 'cthanhnguyen',role: 'user'})));
  server.use(router);
};
