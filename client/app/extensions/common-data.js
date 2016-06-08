export default class CommonData {
  constructor(Promise, SelectOption) {
    this.Promise = Promise;
    this.SelectOption = SelectOption
  }

  cities() {
    const self = this;
    if (self._cities)
      return self.Promise.resolve(this._cities);

    return this.SelectOption.cities().$promise
      .then((data) => {
        self._cities = data;
        return self.Promise.resolve(data);
      })
      .catch((err) => {
        return self.Promise.reject(err);
      });
  }

  campaignCategories() {
    const self = this;
    if (self._campaignCategories)
      return self.Promise.resolve(this._campaignCategories);

    return this.SelectOption.campaignCategories().$promise
      .then((data) => {
        self._campaignCategories = data;
        return self.Promise.resolve(data);
      })
      .catch((err) => {
        return self.Promise.reject(err);
      });
  }

  hotspotCategories() {
    const self = this;
    if (self._hotspotCategories)
      return self.Promise.resolve(this._hotspotCategories);

    return this.SelectOption.hotspotCategories().$promise
      .then((data) => {
        self._hotspotCategories = data;
        return self.Promise.resolve(data);
      })
      .catch((err) => {
        return self.Promise.reject(err);
      });
  }

  static factory(Promise, SelectOption) {
    CommonData.instance = new CommonData(Promise, SelectOption);
    return CommonData.instance;
  }
}

CommonData.factory.$inject = ['$q', 'SelectOption'];
