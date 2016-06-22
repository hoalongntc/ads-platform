'use strict';

var redis = require('redis');
var clientStore = null;
var clientPub = null;
var clientSub = null;
var mainChannel = 'pubsub';
var config = require('../server/config.json') || {};

module.exports = {
  clientStore: clientStore,
  clientPub: clientPub,
  clientSub: clientSub,
  initRedisService: initRedisService,
  set: set,
  get: get,
  del: del,
  hset: hset,
  hget: hget,
  hkeys: hkeys,
  hdel: hdel,
  hexists: hexists,
  setex: setex
}

function initRedisService() {
  clientStore = redis.createClient(config.redis.port, config.redis.host);
  clientPub = redis.createClient(config.redis.port, config.redis.host);
  clientSub = redis.createClient(config.redis.port, config.redis.host);
  if(config.redis.pass) {
    clientStore.auth(config.redis.pass);
    clientPub.auth(config.redis.pass);
    clientSub.auth(config.redis.pass);
  }
  clientStore.on("error", function (err) {
    console.error(err);
  });
  clientStore.on("connect", function (err) {
    console.log("Connected to Redis server");
  });

  clientSub.subscribe(mainChannel);
  clientSub.on("message", function(channel, message){
    console.log('Redis event, ' + channel + ', ' + message);
  });
}

function set(key, value) {
  clientStore.set(key, value);
}

function hset(store, key, value) {
  clientStore.hset(store, key, value);
}
/**
 * @param key
 * @param callback
 */
function get(key, callback) {
  clientStore.get(key, callback);
}

function hget(store, key, callback) {
  clientStore.hget(store, key, callback);
}

function hkeys(store, callback) {
  clientStore.hkeys(store, callback);
}

function del(key) {
  clientStore.del(key);
}

function hdel(store, key) {
  clientStore.hdel(store, key);
}

function hexists(store, key) {
  clientStore.hexists(store, key);
}

function setex(key, time, value) {
  clientStore.setex(key, time, value);
}
