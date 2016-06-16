import $ from 'jquery'

export default class CampaignCtrl {
  constructor(Campaign, CommonData) {
    this.setup();
    this.Campaign = Campaign;
    CommonData.campaignCategories()
      .then((data) => {
        this.campaignCategories = data;
      })
      .catch((err) => {
        console.error(err);
      });
    CommonData.cities()
      .then((data) => {
        this.cities = data;
      })
      .catch((err) => {
        console.error(err);
      });
    CommonData.cities()
      .then((data) => {
        this.cities = data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  setup() {
    this.campaign = true;

    //step1
    this.showstep1 = true;
    this.next12 = false;
    //step2
    this.step2 = false;
    this.next21 = false;
    //step3
    this.step3 = false;
    this.next31 = false;

    this.showstep1_1 = false;
    this.showstep1_2 = false;
    this.showstep1_3 = false;
    this.showstep1_4 = false;
    this.showstep1_5 = false;
    this.showstep1_6 = false;


    this.step3_2 = false;
    this.divLocation = false;

    this.ages = [];
    for (var i = 0; i < 45; i++) {
      this.ages.push({ id: i + 1, label: i + 1 });
    }

    this.times = [];
    for (var i = 0; i < 24; i++) {
      this.times.push({ id: i + 1, label: i + 1 + ':00' });
    }

    this.agesfrom = this.ages[17];
    this.agesto = this.ages[22];


    $('#datetimepicker6').datetimepicker({
      format: 'MMM - DD, YYYY'
    });
    $('#datetimepicker7').datetimepicker({
      useCurrent: false,
      format: 'MMM - DD, YYYY'
    });
    $("#datetimepicker6").on("dp.change", function (e) {
      $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
    });
    $("#datetimepicker7").on("dp.change", function (e) {
      $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
    });
  }

  next1_1() {
    if (!this.option || !this.option.step1)
      return;
    this.showstep1 = false;
    this.next12 = true;
    this.showstep1_2 = true;
  }

  modalClick() {
    this.divLocation = true;
  };
  okLocation() {
    this.divLocation = false;
  };

  next1_2() {
    $('#campaign-icon').css('color', '#45E252');
    this.next12 = false;
    this.showstep1_1 = false;
    this.showstep1_2 = false;
    this.showstep1_3 = false;
    this.showstep1_4 = false;
    this.showstep1_5 = false;
    this.showstep1_6 = false;
    this.next21 = true;
    this.step2 = true;

  };

  next2() {
    $('#adset-icon').css('color', '#45E252');
    this.next21 = false;
    this.step2 = false;
    this.step3 = true;
    this.next31 = true;
    this.show3 = true;
    this.show31 = false;
  };

  back1() {
    this.showstep1 = true;
    this.next12 = false;
    this.showstep1_1 = false;
    this.showstep1_2 = false;
    this.showstep1_3 = false;
    this.showstep1_4 = false;
    this.showstep1_5 = false;
    this.showstep1_6 = false;
  };

  back2() {
    this.next21 = false;
    this.step2 = false;
    this.next12 = true;
    switch (this.option.step1) {
      case "option1":
        this.showstep1_1 = true;
        break;
      case "option2":
        this.showstep1_2 = true;
        break;
      case "option3":
        this.showstep1_3 = true;
        break;
      case "option4":
        this.showstep1_4 = true;
        break;
      case "option5":
        this.showstep1_5 = true;
        break;
      case "option6":
        this.showstep1_6 = true;
        break;
    }
    $('#campaign-icon').css('color', '#ffffff');
  };

  back3() {
    $('#adset-icon').css('color', '#ffffff');
    this.next21 = true;
    this.step2 = true;
    this.step3 = false;
    this.next31 = false;
  };

  prebook() {
    this.show3 = false;
    this.show31 = true;
    this.preview = true;
    this.step3 = false;
  };

  editbook() {
    this.show3 = true;
    this.show31 = false;
    this.preview = false;
    this.step3 = true;
    this.next31 = true;
  };

  placebook() {
    this.finalstep = false;
    this.campaign = false;
    this.step3_2 = true;
    this.actionprocess = "Processing...";
  }
}