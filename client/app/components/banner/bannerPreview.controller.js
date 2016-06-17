import _ from 'lodash'

export default class BannerPreviewCtrl {
  constructor(Banner,state,sce) {
    this.Banner =Banner;
    this.sce = sce;
    this.setup(state.params);
  }
  edit(bannerForm){

  }
  setup(params) {
    if(params.id){
      this.Banner.findById({id:params.id}).$promise.then((response)=>{
        this.pojo = response;
         this.previewCode=this.sce.trustAsHtml(response.htmlCode);
        //$("#contentPreview").append(response.htmlCode)
      }).catch((error)=>{
        this.errorMessage = "Not found this banner!"
      })
    }
    this.testhtml="<p>test html</p>"
  }
}
BannerPreviewCtrl.$inject = ['Banner','$state','$sce'];
