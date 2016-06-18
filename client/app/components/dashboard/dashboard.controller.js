export default class DashboardCtrl {
  constructor(CommonData) {
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

DashboardCtrl.$inject = ['CommonData'];
