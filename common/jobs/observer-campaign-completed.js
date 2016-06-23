import redisService from '../RedisService';
import config from '../../server/config.json';

export default (app, agenda) => {

  agenda.define('observer-campaign-completed', {concurrency: 1, priority: 'normal', lockLifetime: 300}, (job, cb) => {
    console.log('starting observer-campaign-completed jobs');
    const {ReportTracking1, Campaign} = app.models;
    // find all active campaign
    // Query all reference report click base on active campaign Id list
    // Query all report click per day base on active campaign id list

    const today = new Date();

    redisService.hgetall(config.campaign_list_redis_key, (reerr, obj) => {

      let fromCache = obj;
      if (!fromCache) {
        cb();
        return;
      }
      let allActiveCampaign = Object.keys(fromCache).map((item) => (JSON.parse(fromCache[item])));

      const completedCampaign = allActiveCampaign.filter((item) => {
        return item.scheduleTo < today;
      });

      allActiveCampaign = allActiveCampaign.filter((item) => {
        return (completedCampaign.indexOf(item) < 0);
      });

      // convert active campaign to map
      let campaignIdMap = allActiveCampaign.reduce((last, item) => {
        last[item.id] = item;
        return last;
      }, {});

      ReportTracking1.find({
        // where: {
        //   campaignId: {'inq': Object.keys(campaignIdMap)},
        //   reportDate: null
        // }
      })
        .then((response) => {
          const allReferenceReportClick = response.map((item) => (item.__data));
          allReferenceReportClick.forEach((item) => {
            if (campaignIdMap[item.campaignId]) {
              let campaign = campaignIdMap[item.campaignId];
              if (campaign.kpi <= item.clickCount) {
                completedCampaign.push(campaign);
              }
            }
          });

          Campaign.updateAll({id: {'inq': completedCampaign.map((item) => (item.id))}}, {active: false})
            .then((result) => {
              completedCampaign.forEach((item) => {
                redisService.hdel(config.campaign_list_redis_key, item.id);
              });
              console.log(`Campaign ${completedCampaign} completed`);
              cb();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    });
  });
};
