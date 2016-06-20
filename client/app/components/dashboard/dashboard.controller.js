class DashboardCtrl {
  constructor(currentUser, CommonData) {
    this.CommonData = CommonData;

    CommonData.cities()
      .then((data) => {
        console.log('Cities', data);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

export default angular
  .module('dashboard.controller', [])
  .controller('DashboardCtrl', DashboardCtrl);
