import $ from 'jquery'

export default class CampaignCtrl {
  constructor(Campaign, CommonData, Location) {
    this.Campaign = Campaign;
    this.CommonData = CommonData;
    this.Location = Location;
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

    this.branches = ['X-men', 'Hp', 'Vinamilk', 'HTC'];
    this.kpiTypes = ['Clicks'];
    this.genders = [{ text: 'All', value: 'all_gender' },
                    { text: 'Men', value: 'men' },
                    { text: 'Women', value: 'women' }];
    this.devices = [{ text: 'All', value: 'all_device' },
                    { text: 'iOS', value: 'ios' },
                    { text: 'Android', value: 'android' },
                    { text: 'Other', value: 'other' }];

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

    this.selected.ageFrom = this.ages[17];
    this.selected.ageTo = this.ages[22];
    this.selected.gender = this.genders[0];
    this.selected.device = this.devices[0];
    this.selected.kpi = 1000;
    this.selected.kpiType = this.kpiTypes[0];
    this.selected.branch = this.branches[0];

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
    this.divLocation = false;
  };

  next1_2() {
    if(!this.selected.branch)
      return;

    $('#campaign-icon').css('color', '#45E252');
    this.step1_2 = false;
    this.showstep1_2 = false;
    this.next21 = true;
    this.step2 = true;

  }

  next2() {
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
    this.campaign = false;
    this.step3_2 = true;
    this.actionprocess = "Processing...";
  }

  setLocationSelected(location, isSelected) {
    location.selected = isSelected;
  }
}

export default angular
  .module('campaign.controller', [])
  .controller('CampaignCtrl', CampaignCtrl);
