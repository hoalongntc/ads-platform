
export default class BannerListCtrl {
  constructor(Banner) {
    this.Banner =Banner;
    this.setup();
  }
  load(page=1){
    this.listBanner = this.Banner.find({
      filter: {limit: 50,skip:(page-1)*50}
    })
    this.Banner.count().$promise.then((result)=>{
      this.total = result;
      let totalPage = parseInt(this.total.count/50)+1
      this.pageList = Array.apply(null, {length: totalPage}).map((item,index)=>(index+1))
    });

  }
  alertDelete(banner){
    this.deleteBanerConfirm = banner
    $("#deleteAlert").modal()
  }
  deleteBanner(banner){
    this.Banner.deleteById({ id: banner.id }).$promise.then(()=>{
      this.load();
      $("#deleteAlert").modal('hide');
    })
  }
  setup() {
    this.currentPage = 1;
    this.load()
  }
}
BannerListCtrl.$inject = ['Banner'];
