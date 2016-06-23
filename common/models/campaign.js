import RedisService from '../RedisService';
import config from '../../server/config.json'


module.exports = function(Campaign) {

  Campaign.observe('after save', function saveToRedis(ctx, next) {
    var campaign = ctx.instance;
    if(campaign) {
      if(campaign.active) {
        RedisService.hset(config.campaign_list_redis_key, campaign.id, JSON.stringify(campaign));
      } else {
        RedisService.hdel(config.campaign_list_redis_key, campaign.id);
      }
    }
    next();
  });
};
