
export default class BannerCtrl {
  constructor(Banner,state) {
    this.Banner =Banner;
    console.log(state)
    this.setup(state.params);
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
  setup(params) {
    this.banner = true;
    this.pojo={}

    if(params.id){
      this.Banner.findById({id:params.id}).$promise.then(result=>{
        this.pojo = result;
        CKEDITOR.replace( 'htmlEditor' );
      }).catch(error=>{
        this.actionError = true;
      });
    }else{
       CKEDITOR.replace( 'htmlEditor' );
    }
    //innit ckeditor plugin for richtext

  }
  
}
BannerCtrl.$inject = ['Banner','$state'];
