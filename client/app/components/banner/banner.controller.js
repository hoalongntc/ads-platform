
export default class BannerCtrl {
  constructor(Banner) {
    this.Banner =Banner;
    this.setup();
  }
  edit(){
    // assign rich text manualy because
    // ckeditor plugin cannot bind data directly with ng-model
    this.pojo.htmlCode=CKEDITOR.instances.htmlEditor.getData();
    if(!this.pojo.id){
      this.pojo = this.Banner.create(this.pojo)
    }else{
      this.pojo.$save()
    }
    this.actionSuccess = true
  }
  setup() {
    this.banner = true;
    this.pojo={}
    //innit ckeditor plugin for richtext
    CKEDITOR.replace( 'htmlEditor' );
  }
}
BannerCtrl.$inject = ['Banner'];
