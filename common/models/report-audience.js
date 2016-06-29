import loopback from 'loopback';
import Promise from 'bluebird';
import lodash from 'lodash';

module.exports = function(ReportAudience) {

  const getReportData = (context, reportType) => {
    const {Location, Campaign, ReportAudience1, ReportAudience2, ReportAudience3, ReportAudience4} = ReportAudience.app.models;
    const currentProfile = context.get('currentProfileId');
    let fieldOption = {};
    fieldOption[reportType] = 1;

    switch (currentProfile) {
      case Profile.ADMIN:
        return ReportAudience1.find({fields: fieldOption});
      case Profile.ADVERTISER:
        return ReportAudience1.find({where: {advertiserId: context.get('currentUserId')}, field: fieldOption});
      case Profile.PUBLISHER:
        return Location
          .find({fields: {id: 1}})
          .then(locations => locations.map(location => location.id))
          .then(locationIds => {
            return {locationId: {inq: locationIds}};
          });
      case Profile.CLIENT:
        return Campaign
          .find({fields: {id: 1}})
          .then(campaigns => campaigns.map(campaign => campaign.id))
          .then(campaignIds => {
            return {campaignId: {inq: campaignIds}};
          });
      default:
        return Promise.reject(false);
    }
  };

  ReportAudience.getReport = (reportType) => {
    const {Profile} = ReportAudience.app.models;
    const context = loopback.getCurrentContext();

    getReportData(context)
      .then(report => {
        
      });
  };
};
