import $ from 'jquery'
import moment from 'moment'
require('angucomplete-alt');
import '../../../assets/styles/components/campaign.less';

export default class CampaignCtrl {
  constructor(Campaign, CommonData, Location, Brand, Banner, CampaignMapping) {
    this.Campaign = Campaign;
    this.CommonData = CommonData;
    this.Location = Location;
    this.Banner = Banner;
    this.Brand = Brand;
    this.CampaignMapping = CampaignMapping;
    this.setup();
  }

  setup() {
    this.campaign = true;
    this.selected = {};
    //step1
    this.showstep1 = true;
    this.step1_2 = false;
    this.showstep1_2 = false;
    //step2
    this.step2 = false;
    this.next21 = false;
    //step3
    this.step3 = false;
    this.next31 = false;

    this.step3_2 = false;
    this.divLocation = false;

    this.preview = false;

    // prepare data
    this.ages = [];
    for (var i = 0; i < 99; i++) {
      this.ages.push({ id: i + 1, label: i + 1 });
    }

    this.times = [];
    for (var i = 0; i < 24; i++) {
      this.times.push({ id: i + 1, label: i + 1 + ':00' });
    }

    this.dpFromOptions = {
      format: 'MMM - DD, YYYY'
    };
    this.dpToOptions = {
      format: 'MMM - DD, YYYY'
    };

    // fetch select data
    this.CommonData.campaignCategories()
      .then((data) => {
        this.campaignCategories = data;
        if(data.length > 0) {
          this.selected.campaignCategory = data[0];
        }
      })
      .catch((err) => {
        console.error(err);
      });

    this.CommonData.cities()
      .then((data) => {
        this.cities = data;
      })
      .catch((err) => {
        console.error(err);
      });

    this.CommonData.locationCategories()
      .then((data) => {
        this.locationCategories = data;
      })
      .catch((err) => {
        console.error(err);
      });

    this.kpiTypes = ['Clicks'];
    this.genders = [{ text: 'All', value: 'all_gender' },
                    { text: 'Men', value: 'men' },
                    { text: 'Women', value: 'women' }];
    this.devices = [{ text: 'All', value: 'all_device' },
                    { text: 'iOS', value: 'ios' },
                    { text: 'Android', value: 'android' },
                    { text: 'Other', value: 'other' }];

    this.Brand.find()
      .$promise.then((data) => {
        this.brands = data;
        if(data.length > 0) {
          this.selected.brand = data[0];
        }
      })
      .catch((err) => {
        console.error(err);
      });
    this.Location.find()
      .$promise.then((data) => {
        this.locations = data
          .map((location) =>
            {
              location.selected = false;
              location.kpi = 0;
              return location;
            });
      })
      .catch((err) => {
        console.error(err);
      });
    this.Banner.find()
      .$promise.then((data) => {
        this.bannerMobiles = data.filter((banner) => banner.target != 'desktop');
        this.bannerDesktops = data.filter((banner) => banner.target != 'mobile');
      })
      .catch((err) => {
        console.error(err);
      });

    this.selected.ageFrom = this.ages[17];
    this.selected.ageTo = this.ages[22];
    this.selected.gender = this.genders[0];
    this.selected.device = this.devices[0];
    this.selected.kpi = 1000;
    this.selected.kpiType = this.kpiTypes[0];

    this.selected.scheduleFrom = moment();
    this.selected.scheduleTo = moment();
    this.selected.timeFrom = this.times[11];
    this.selected.timeTo = this.times[11];
    this.selected.bannerMobile ={};
    this.selected.bannerDesktop ={};

    this.locationInvalid = 'locationInvalid';
  }

  next1_1() {
    if (!this.selected.campaignCategory)
      return;

    this.showstep1 = false;
    this.step1_2 = true;
    this.showstep1_2 = true;
  }

  modalClick() {
    this.divLocation = true;
  };
  okLocation() {
    this.getSelectedLocations();

    if(this.selected.locations.length <= 0) {
      this.locationInvalid = 'locationInvalid';
      return
    }

    this.divLocation = false;
    this.locationInvalid = '';
  };

  next1_2() {
    if(!this.selected.brand)
      return;

    $('#campaign-icon').css('color', '#45E252');
    this.step1_2 = false;
    this.showstep1_2 = false;
    this.next21 = true;
    this.step2 = true;

  }

  getSelectedLocations() {
    this.selected.locations = this.locations
      .filter((location) => { return location.selected === true; })
      .map((location) => {
        return {
          name: location.name,
          category: location.categoryName,
          kpiPerDay: location.kpi
        };
      });
  }

  next2(form) {
    this.getSelectedLocations();

    if(this.selected.locations.length <= 0) {
      this.locationInvalid = 'locationInvalid';
      return
    }

    if(!this.selected.adSet) {
      return;
    }

    $('#adset-icon').css('color', '#45E252');
    this.next21 = false;
    this.step2 = false;
    this.step3 = true;
    this.next31 = true;
    this.show3 = true;
    this.show31 = false;
  }

  back1() {
    this.showstep1 = true;
    this.step1_2 = false;
    this.showstep1_2 = false;
  }

  back2() {
    this.next21 = false;
    this.step2 = false;
    this.step1_2 = true;
    this.showstep1_2 = true;
    $('#campaign-icon').css('color', '#ffffff');
  }

  back3() {
    $('#adset-icon').css('color', '#ffffff');
    this.next21 = true;
    this.step2 = true;
    this.step3 = false;
    this.next31 = false;
  }

  prebook() {
    this.show3 = false;
    this.show31 = true;
    this.preview = true;
    this.step3 = false;
  }

  editbook() {
    this.show3 = true;
    this.show31 = false;
    this.preview = false;
    this.step3 = true;
    this.next31 = true;
  }

  placebook() {
    if(!this.selected.bannerDesktop.originalObject || !this.selected.bannerMobile.originalObject) {
      return;
    }

    this.campaign = false;
    this.step3_2 = true;

    this.actionprocess = "Processing...";

    this.saveCampain();
  }

  setLocationSelected(location, isSelected) {
    location.selected = isSelected;
  }

  saveCampain() {
    let scheduleFromStr = this.selected.scheduleFrom.format('YYYYMMDD') + this.selected.timeFrom.id;
    let scheduleFrom = moment(scheduleFromStr, 'YYYYMMDDH').valueOf();
    let scheduleToStr = this.selected.scheduleTo.format('YYYYMMDD') + this.selected.timeTo.id;
    let scheduleTo = moment(scheduleToStr, 'YYYYMMDDH').valueOf();

    let audience = {
      age: [this.selected.ageFrom.id, this.selected.ageTo.id],
      gender: this.selected.gender.value,
      os: this.selected.device.value
    };

    this.campaignObj = {
      active: false,
      name: this.selected.name,
      brandId: this.selected.brand.id,
      brandName: this.selected.brand.name,
      categoryId: this.selected.campaignCategory.value,
      categoryName: this.selected.campaignCategory.text,
      audience: audience,
      scheduleFrom: scheduleFrom,
      scheduleTo: scheduleTo,
      kpi: this.selected.kpi,
      name: this.selected.adSet,
      landingPageUrl: this.selected.landingPage,
      bannerDesktopId: this.selected.bannerDesktop.originalObject.id,
      bannerDesktopName: this.selected.bannerDesktop.originalObject.name,
      bannerMobileId: this.selected.bannerMobile.originalObject.id,
      bannerMobileName: this.selected.bannerMobile.originalObject.name,
      locations: this.selected.locations
    };

    this.Campaign.create(this.campaignObj)
      .$promise
      .then((response) => {
        this.campaignObj = response;
      })
      .then((response) => {
        let priority = new Date().getTime() / 1000;
        let compaignMappings = this.locations
          .filter((location) => { return location.selected === true; })
          .map((location) => {
            return {
              campaignId: this.campaignObj.id,
              campaignName: this.campaignObj.name,
              audience: audience,
              locationId: location.id,
              locationName: location.name,
              kpiPerDay: location.kpi,
              priority: priority
            };
          });
        this.CampaignMapping.createMany(compaignMappings)
          .$promise
          .then((response) => {
            this.actionprocess = "Your booking has been placed!";
          })
          .catch((error) => {
            this.actionprocess = "Error when save campain!";
            console.error(error);
          });
      })
      .catch((error) => {
        this.actionprocess = "Error when save campain!";
        console.error(error);
      });
  }
}

export default angular
  .module('campaign.controller', ['angucomplete-alt'])
  .controller('CampaignCtrl', CampaignCtrl);
