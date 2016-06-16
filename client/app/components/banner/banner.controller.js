
export default class BannerCtrl {
  constructor(Banner) {
    this.Banner =Banner;
    this.setup();
  }
  edit(){
    // assign rich text manualy because
    // ckeditor plugin cannot bind data directly with ng-model
    this.pojo.htmlCode=CKEDITOR.instances.htmlEditor.getData();
    this.pojo = this.Banner.create(this.pojo)
    
  }
  setup() {
    this.banner = true;
    this.pojo={}

    //innit ckeditor plugin for richtext
    CKEDITOR.replace( 'htmlEditor' );
  }
}
BannerCtrl.$inject = ['Banner'];
