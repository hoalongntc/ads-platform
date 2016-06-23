import RedisService from '../RedisService';

module.exports = function(Campaign) {

  Campaign.observe('after save', function saveToRedis(ctx, next) {
    var campaign = ctx.instance;
    if(campaign) {
      RedisService.hset("campaign", campaign.id, JSON.stringify(campaign));
    }
    next();
  });
};
