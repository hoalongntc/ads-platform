const page_size = 10
export default class BannerListCtrl {
  constructor(Banner,state) {
    this.Banner =Banner;
    this.state = state
    this.setup(state);
  }
  setup(state) {
    this.orderDirect = state.params.orderDirect?state.params.orderDirect:'DESC';
    this.orderKey = state.params.orderKey?state.params.orderKey:'id';
    this.page = state.params.page?state.params.page:1;
    this.load(this.page,this.orderKey,this.orderDirect)
  }
  load(page=1,orderKey,orderDirect){
    this.currentPage = page
    var order = `${orderKey} ${orderDirect}`
    this.listBanner = this.Banner.find({
      filter: {
        limit: page_size,
        skip:(this.currentPage-1)*page_size,
        order
      }
    })
    this.Banner.count().$promise.then((result)=>{
      this.total = result;
      let totalPage = parseInt(this.total.count/page_size)+1
      this.pageList = Array.apply(null, {length: totalPage}).map((item,index)=>(index+1))
    });
  }
  orderToggle(orderKey){
    if(orderKey == this.orderKey){
      this.orderDirect = this.orderDirect?this.orderDirect=="DESC"?"ASC":"DESC":"DESC"
    }else{
      this.orderDirect = "DESC"
    }
    this.orderKey = orderKey;
    this.state.transitionTo("banList",{orderKey:orderKey,orderDirect:this.orderDirect});
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

}
BannerListCtrl.$inject = ['Banner','$state'];
