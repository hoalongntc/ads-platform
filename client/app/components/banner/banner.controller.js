import $ from 'jquery'

export default class BannerCtrl {
  constructor() {
    this.setup();
  }

  setup() {
    
  }
  
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
