export default class DashboardCtrl {
  constructor(CommonData) {
    this.CommonData = CommonData;
    let self = this;

    CommonData.cities()
      .then((data) => {
        console.log('Cities', data);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  //////////////////////////////////////////////////Maps////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // const map = L.map('map').setView([14.7828, 106.677], 6);

  // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  //   attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  // }).addTo(map);

  // L.marker([14.7828, 106.677]).addTo(map)
  //   .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
  //   .openPopup();

  // $scope.showMapAll = function () {
  //   map.setView([14.7828, 106.677], 6);
  // };
}

DashboardCtrl.$inject = ['CommonData'];
