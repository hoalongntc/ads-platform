import _ from 'lodash'
const type_table_values = [{key: "standard", label: "Image"}, {key: "rich", label: "Html Code"}]
const device_table_values = [{key: "all", label: "All"}, {key: "mobile", label: "Mobile"}, {
  key: "desktop",
  label: "Desktop"
}]
CKEDITOR.config.allowedContent = true;
var innitCkEdittor = (id) =>{
  CKEDITOR.replace(id,{
    filebrowserBrowseUrl: '/FileSystem',
    filebrowserImageBrowseUrl: '/FileSystem',
    filebrowserUploadUrl: '/FileSystem',
    filebrowserImageUploadUrl: '/FileSystem'
  });
}
class BannerCtrl {
  constructor(Banner, $state) {
    this.Banner = Banner;
    this.setup($state.params);
  }

  edit(bannerForm) {
    // assign rich text manualy because
    // ckeditor plugin cannot bind data directly with ng-model
    this.deviceOption = device_table_values;
    this.typeOption = type_table_values;
    this.pojo.htmlCode = CKEDITOR.instances.htmlEditor.getData();
    console.log(bannerForm);
    if (!this.pojo.id) {
      this.Banner.create(this.pojo).$promise.then(reponse=> {
        this.pojo = reponse;
        this.actionSuccess = true
      }).catch(response=> {
        if (response.data.error.status == 422) {
          let message = response.data.error.details.messages;
          this.messageList = [];
          Object.keys(message).forEach((item)=> {
            _.set(bannerForm, `${item}.$valid`, false);
            _.set(bannerForm, `${item}.$invalid`, true);
            this.messageList.push(item + ": " + message[item]);
            console.log(bannerForm);
            this.actionSuccess = false;
          })
        }

      })
    } else {
      this.pojo.$save()
      this.actionSuccess = true;
    }

  }

  clearPojo() {
    this.pojo = {}
  }

  setup(params) {
    this.banner = true;
    this.pojo = {}

    if (params.id) {
      this.Banner.findById({id: params.id}).$promise.then(result=> {
        this.pojo = result;
        innitCkEdittor('htmlEditor');
      }).catch(error=> {
        this.actionError = true;
      });
    } else {
      innitCkEdittor('htmlEditor');
    }
    //innit ckeditor plugin for richtext

  }

}

export default angular.module('banner.controller', []).controller('BannerCtrl', BannerCtrl);
