import angular from 'angular';

class CommonData {
  constructor(Promise, SelectOption) {
    this.Promise = Promise;
    this.SelectOption = SelectOption;
  }

  cities() {
    if (this._cities) {
      return this.Promise.resolve(this._cities);
    }

    return this.SelectOption.cities().$promise
      .then((data) => {
        this._cities = data;
        return this.Promise.resolve(data);
      })
      .catch((err) => {
        return this.Promise.reject(err);
      });
  }

  campaignCategories() {
    if (this._campaignCategories) {
      return this.Promise.resolve(this._campaignCategories);
    }

    return this.SelectOption.campaignCategories().$promise
      .then((data) => {
        this._campaignCategories = data;
        return this.Promise.resolve(data);
      })
      .catch((err) => {
        return this.Promise.reject(err);
      });
  }

  locationCategories() {
    if (this._locationCategories) {
      return this.Promise.resolve(this._locationCategories);
    }

    return this.SelectOption.locationCategories().$promise
      .then((data) => {
        this._locationCategories = data;
        return this.Promise.resolve(data);
      })
      .catch((err) => {
        return this.Promise.reject(err);
      });
  }

  static factory($q, SelectOption) {
    'ngInject';
    CommonData.instance = new CommonData($q, SelectOption);
    return CommonData.instance;
  }
}

export default angular
  .module('app.factory.common-data', [])
  .factory('CommonData', CommonData.factory);
