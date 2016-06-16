const type_table_values=[{key:"standard",label:"Image"},{key:"rich",label:"Html Code"}]
const device_table_values=[{key:"all",label:"All"},{key:"mobile",label:"Mobile"},{key:"desktop",label:"Desktop"}]
export default class BannerCtrl {
  constructor(Banner,state) {
    this.Banner =Banner;
    console.log(state)
    this.setup(state.params);
  }
  edit(){
    // assign rich text manualy because
    // ckeditor plugin cannot bind data directly with ng-model
    this.deviceOption = device_table_values;
    this.typeOption = type_table_values;
    this.pojo.htmlCode=CKEDITOR.instances.htmlEditor.getData();
    if(!this.pojo.id){
      this.Banner.create(this.pojo).$promise.then(reponse=>{
        this.pojo = reponse;
      }).catch(response=>{
        if(response.data.error.status ==422){
          let message = response.data.error.details.messages;
          Object.keys(message).forEach((item)=>{
            this.pojo[item].$valid = false;
            this.pojo[item].$invalid = true;
          })
        }

      })
    }else{
      this.pojo.$save()
    }
    this.actionSuccess = true
  }
  clearPojo(){
    this.pojo={}
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
