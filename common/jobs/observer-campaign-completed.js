import Promise from 'bluebird';

export default (app, agenda)=> {
  const models = app.models;
  const {ReportTracking1, Campaign} = models.Campaign;
  agenda.define("observer-campaign-completed", {concurrency: 1, priority: 'normal'}, (job, cb)=> {
    // find all to list hit database 2 time
    let allActiveCampain = Campaign.find({where: {active: {"neq": null}}})
    let campaignIdArray = allActiveCampain.map((item)=>(item.id))
    let allRefernceReportClick = ReportTracking1.find({where:{campaignId:{"inq":campaignIdArray}}})
  })
}
