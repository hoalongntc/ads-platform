import $ from 'jquery'

export default class BannerCtrl {
  constructor() {
    this.setup();
  }
  setup() {
    this.banner = true;
    CKEDITOR.replace( 'htmlEditor' ); 
  }
}
