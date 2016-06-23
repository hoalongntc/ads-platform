import Promise from 'bluebird';
import redisService from '../RedisService'
import config from '../../server/config.json'

export default (app, agenda) => {

  agenda.define("observer-campaign-completed", (job, cb) => {
    console.log("starting observer-campaign-completed jobs");
    const {ReportTracking1, Campaign} = app.models;
    // find all active campaign
    // Query all reference report click base on active campaign Id list
    // Query all report click per day base on active campaign id list

    let today = new Date();

    // let allActiveCampain = Campaign.find({where: {active: true}})
    let fromCache = redisService.hgetall(config.campaign_list_redis_key);
    if (!fromCache) {
      cb();
    }
    let allActiveCampaign = JSON.parse(fromCache);

    let completedCampaign = allActiveCampaign.filter((item) => {
      return item.scheduleTo < today;
    });
    allActiveCampaign = allActiveCampaign.subtract(completedCampaign);

    // convert active campaign to map
    let campaignIdMap = allActiveCampain.reduce((last, item) => {
      return last[item.id] = item;
    }, []);

    let allReferenceReportClick = ReportTracking1.find({
      where: {
        campaignId: {"inq": Object.keys(campaignIdMap)},
        trackingDate: null
      }
    });

    completedCampaign = allReferenceReportClick.reduce((last, item) => {
      let campaign = campaignIdMap[item.campaignId];
      if (campaign.kpi < item.clickCount) {
        last.push(campaign.id);
      }
    }, completedCampaign);

    allActiveCampaign = allActiveCampaign.subtract(completedCampaign);

    Campaign.updateAll({campaignId: {"inq": completedCampaign}}, {active: false})
      .then(function (result) {
        allActiveCampaign = allActiveCampaign.filter(() => {
        });
        completedCampaign.forEach((item) => {
          redisService.hdel(config.campaign_list_redis_key, item.id);
        })
        console.log(`Campaign ${completedCampaign} completed`);
        cb();
      })
      .catch(function (err) {
        console, log(err);
      });

  })
}
