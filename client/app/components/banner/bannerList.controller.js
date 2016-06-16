const page_size = 10
export default class BannerListCtrl {
  constructor(Banner) {
    this.Banner =Banner;
    this.setup();
  }
  load(page=1){
    this.currentPage = page
    this.listBanner = this.Banner.find({
      filter: {limit: page_size,skip:(this.currentPage-1)*page_size}
    })
    this.Banner.count().$promise.then((result)=>{
      this.total = result;
      let totalPage = parseInt(this.total.count/page_size)+1
      this.pageList = Array.apply(null, {length: totalPage}).map((item,index)=>(index+1))
    });

  }
  alertDelete(banner){
    this.deleteBanerConfirm = banner
    $("#deleteAlert").modal()
  }
  gotoPage(page){
    this.load(page)
  }
  deleteBanner(banner){
    this.Banner.deleteById({ id: banner.id }).$promise.then(()=>{
      this.load();
      $("#deleteAlert").modal('hide');
    })
  }
  setup() {
    ;
    this.load()
  }
}
BannerListCtrl.$inject = ['Banner'];
