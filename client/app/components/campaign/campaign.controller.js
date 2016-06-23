import $ from 'jquery'
import moment from 'moment'
import '../../../assets/styles/components/campaign.less'

export default class CampaignCtrl {
  constructor(Campaign, CommonData, Location, Brand, Banner, CampaignMapping, $state) {
    this.Campaign = Campaign
    this.CommonData = CommonData
    this.Location = Location
    this.Banner = Banner
    this.Brand = Brand
    this.CampaignMapping = CampaignMapping
    this.setup($state.params)
  }

  setup(params) {
    this.prepairData()

    if(params.id) {
      this.Campaign.findById({id: params.id})
        .$promise.then((campaign) => {
          this.editCampaign(campaign);
        }).catch((error) => {
          console.error(error)
          this.newCampaign()
        })
    } else {
      this.newCampaign()
    }

  }

  editCampaign(campaign){
    this.campaignObj = campaign;
    this.selected.id = campaign.id;

    this.Brand.find()
      .$promise.then((data) => {
      this.brands = data
      if(data.length > 0) {
        let brand = data.filter(data => data.id === campaign.brandId)
        if(brand.length > 0) {
          this.selected.brand = brand[0]
        }
      }
    })
    .catch((err) => {
      console.error(err)
    })
    this.Location.find()
      .$promise.then((data) => {
      this.locations = data
        .map((location) =>
        {
          location.selected = false
          location.kpi = 0
          return location
        })

      this.locations.forEach((location) => {
        let selectedLocation = campaign.locations
          .filter(cl => cl.name === location.name)
        if(selectedLocation.length > 0) {
          location.selected = true
          location.kpi = selectedLocation[0].kpiPerDay
        }

      })
    })
    .catch((err) => {
      console.error(err)
    })
    this.CommonData.campaignCategories()
      .then((data) => {
        this.campaignCategories = data
        if(data.length > 0) {
          this.selected.campaignCategory = data[0]
          let campaignCategory = data.filter(data => data.value === campaign.categoryId)
          if(campaignCategory.length > 0) {
            this.selected.campaignCategory = campaignCategory[0]
          }
        }
      })
      .catch((err) => {
        console.error(err)
      })

    this.Banner.find()
      .$promise.then((data) => {
      this.bannerMobiles = data.filter((banner) => banner.target != 'desktop')
      this.bannerDesktops = data.filter((banner) => banner.target != 'mobile')

      let mobile = this.bannerMobiles.filter(banner => banner.id === campaign.bannerMobileId)
      if(mobile.length > 0) {
        this.selected.bannerMobile = mobile[0]
      }
      let desktop = this.bannerDesktops.filter(banner => banner.id === campaign.bannerDesktopId)
      if(desktop.length > 0) {
        this.selected.bannerDesktop = desktop[0]
      }
    })
    .catch((err) => {
      console.error(err)
    })

    let ageFrom = this.ages.filter(age => age.id === campaign.audience.age[0])
    if(ageFrom.length > 0) {
      this.selected.ageFrom = ageFrom[0]
    }

    let ageTo = this.ages.filter(age => age.id === campaign.audience.age[1])
    if(ageFrom.length > 0) {
      this.selected.ageTo = ageTo[0]
    }

    let gender = this.genders.filter(gender => gender.value === campaign.audience.gender)
    if(gender.length > 0) {
      this.selected.gender = gender[0]
    }

    let device = this.devices.filter(device => device.value === campaign.audience.os)
    if(gender.length > 0) {
      this.selected.device = device[0]
    }
    this.selected.kpi = campaign.kpi
    this.selected.kpiType = this.kpiTypes[0]

    this.selected.landingPage = campaign.landingPageUrl

    this.selected.adSet = campaign.name

    this.selected.scheduleFrom = moment.utc(campaign.scheduleFrom)
    this.selected.scheduleTo = moment.utc(campaign.scheduleTo)
    this.selected.timeFrom = this.times[moment.utc(campaign.scheduleFrom).hour()]
    this.selected.timeTo = this.times[moment.utc(campaign.scheduleTo).hour()]
  }

  prepairData() {
    this.campaign = true
    //step1
    this.showstep1 = true
    this.step1_2 = false
    this.showstep1_2 = false
    //step2
    this.step2 = false
    this.next21 = false
    //step3
    this.step3 = false
    this.next31 = false
    this.step3_2 = false
    this.divLocation = false

    this.preview = false

    // prepare data
    this.ages = []
    for (var i = 0; i < 99; i++) {
      this.ages.push({ id: i + 1, label: i + 1 })
    }

    this.times = []
    for (var i = 0; i < 24; i++) {
      this.times.push({ id: i, label: i + 1 + ':00' })
    }

    this.dpFromOptions = {
      format: 'MMM - DD, YYYY'
    }
    this.dpToOptions = {
      format: 'MMM - DD, YYYY'
    }

    this.kpiTypes = ['Clicks']
    this.genders = [{ text: 'All', value: 'all_gender' },
      { text: 'Men', value: 'men' },
      { text: 'Women', value: 'women' }]
    this.devices = [{ text: 'All', value: 'all_device' },
      { text: 'iOS', value: 'ios' },
      { text: 'Android', value: 'android' },
      { text: 'Other', value: 'other' }]

    // fetch select data
    this.CommonData.cities()
      .then((data) => {
        this.cities = data
      })
      .catch((err) => {
        console.error(err)
      })

    this.CommonData.locationCategories()
      .then((data) => {
        this.locationCategories = data
      })
      .catch((err) => {
        console.error(err)
      })

    this.selected = {}
  }

  newCampaign() {
    this.Brand.find()
      .$promise.then((data) => {
      this.brands = data
      if(data.length > 0) {
        this.selected.brand = data[0]
      }
    })
      .catch((err) => {
        console.error(err)
      })
    this.Location.find()
      .$promise.then((data) => {
      this.locations = data
        .map((location) =>
        {
          location.selected = false
          location.kpi = 0
          return location
        })
    })
      .catch((err) => {
        console.error(err)
      })
    this.CommonData.campaignCategories()
      .then((data) => {
        this.campaignCategories = data
        if(data.length > 0) {
          this.selected.campaignCategory = data[0]
        }
      })
      .catch((err) => {
        console.error(err)
      })

    this.Banner.find()
      .$promise.then((data) => {
      this.bannerMobiles = data.filter((banner) => banner.target != 'desktop')
      if(this.bannerMobiles.length > 0) {
        this.selected.bannerMobile = this.bannerMobiles[0]
      }
      this.bannerDesktops = data.filter((banner) => banner.target != 'mobile')
      if(this.bannerDesktops.length > 0) {
        this.selected.bannerDesktop = this.bannerDesktops[0]
      }
    })
      .catch((err) => {
        console.error(err)
      })

    this.selected.ageFrom = this.ages[17]
    this.selected.ageTo = this.ages[22]
    this.selected.gender = this.genders[0]
    this.selected.device = this.devices[0]
    this.selected.kpi = 1000
    this.selected.kpiType = this.kpiTypes[0]

    this.selected.scheduleFrom = moment.utc()
    this.selected.scheduleTo = moment.utc()
    this.selected.timeFrom = this.times[11]
    this.selected.timeTo = this.times[11]
  }

  next1_1() {
    if (!this.selected.campaignCategory)
      return

    this.showstep1 = false
    this.step1_2 = true
    this.showstep1_2 = true
  }

  modalClick() {
    this.divLocation = true
  }
  okLocation() {
    this.getSelectedLocations()

    if(this.selected.locations.length <= 0) {
      this.locationInvalid = 'locationInvalid'
      return
    }

    this.divLocation = false
    this.locationInvalid = ''
  }

  next1_2() {
    if(!this.selected.brand)
      return

    $('#campaign-icon').css('color', '#45E252')
    this.step1_2 = false
    this.showstep1_2 = false
    this.next21 = true
    this.step2 = true

  }

  getSelectedLocations() {
    this.selected.locations = this.locations
      .filter((location) => { return location.selected === true })
      .map((location) => {
        return {
          name: location.name,
          category: location.categoryName,
          kpiPerDay: location.kpi
        }
      })
  }

  next2() {
    this.getSelectedLocations()

    if(this.selected.locations.length <= 0) {
      this.locationInvalid = 'locationInvalid'
      return
    }

    if(!this.selected.adSet) {
      return
    }

    $('#adset-icon').css('color', '#45E252')
    this.next21 = false
    this.step2 = false
    this.step3 = true
    this.next31 = true
    this.show3 = true
    this.show31 = false
  }

  back1() {
    this.showstep1 = true
    this.step1_2 = false
    this.showstep1_2 = false
  }

  back2() {
    this.next21 = false
    this.step2 = false
    this.step1_2 = true
    this.showstep1_2 = true
    $('#campaign-icon').css('color', '#ffffff')
  }

  back3() {
    $('#adset-icon').css('color', '#ffffff')
    this.next21 = true
    this.step2 = true
    this.step3 = false
    this.next31 = false
  }

  prebook() {
    this.show3 = false
    this.show31 = true
    this.preview = true
    this.step3 = false
  }

  editbook() {
    this.show3 = true
    this.show31 = false
    this.preview = false
    this.step3 = true
    this.next31 = true
  }

  placebook() {
    if(!this.selected.bannerDesktop || !this.selected.bannerMobile) {
      return
    }

    this.campaign = false
    this.step3_2 = true

    this.actionprocess = "Processing..."

    this.saveCampain()
  }

  setLocationSelected(location, isSelected) {
    location.selected = isSelected
    location.kpi = isSelected ? 1 : 0
  }

  saveCampain() {
    let scheduleFromStr = this.selected.scheduleFrom.format('YYYYMMDD') + this.selected.timeFrom.id
    let scheduleFrom = moment.utc(scheduleFromStr, 'YYYYMMDDH').valueOf()
    let scheduleToStr = this.selected.scheduleTo.format('YYYYMMDD') + this.selected.timeTo.id
    let scheduleTo = moment.utc(scheduleToStr, 'YYYYMMDDH').valueOf()

    let audience = {
      age: [this.selected.ageFrom.id, this.selected.ageTo.id],
      gender: this.selected.gender.value,
      os: this.selected.device.value
    }

    if(this.campaignObj && this.campaignObj.id) {
      console.log(this.campaignObj)
      this.campaignObj.brandId = this.selected.brand.id
      this.campaignObj.brandName = this.selected.brand.name
      this.campaignObj.categoryId = this.selected.campaignCategory.value
      this.campaignObj.categoryName = this.selected.campaignCategory.text
      this.campaignObj.audience = audience
      this.campaignObj.scheduleFrom = scheduleFrom
      this.campaignObj.scheduleTo = scheduleTo
      this.campaignObj.kpi = this.selected.kpi
      this.campaignObj.name =  this.selected.adSet
      this.campaignObj.landingPageUrl = this.selected.landingPage
      this.campaignObj.bannerDesktopId = this.selected.bannerDesktop.id
      this.campaignObj.bannerDesktopName = this.selected.bannerDesktop.name
      this.campaignObj.bannerMobileId = this.selected.bannerMobile.id
      this.campaignObj.bannerMobileName = this.selected.bannerMobile.name
      this.campaignObj.locations = this.selected.locations

      this.campaignObj.$save((campaign) => {
        this.CampaignMapping.find({ campaignId: campaign.id })
          .$promise.then((list) => {
            console.log(list)
            list.forEach(element => element.$remove())
        }).then(() => {
          this.saveCampaignMapping(audience);
        })
      }, (error) => {
        console.error(error)
      })
    } else {
      this.campaignObj = {
        active: true,
        brandId: this.selected.brand.id,
        brandName: this.selected.brand.name,
        categoryId: this.selected.campaignCategory.value,
        categoryName: this.selected.campaignCategory.text,
        audience: audience,
        scheduleFrom: scheduleFrom,
        scheduleTo: scheduleTo,
        kpi: this.selected.kpi,
        name: this.selected.adSet,
        landingPageUrl: this.selected.landingPage,
        bannerDesktopId: this.selected.bannerDesktop.id,
        bannerDesktopName: this.selected.bannerDesktop.name,
        bannerMobileId: this.selected.bannerMobile.id,
        bannerMobileName: this.selected.bannerMobile.name,
        locations: this.selected.locations
      }

      this.Campaign.create(this.campaignObj)
        .$promise
        .then((response) => {
          this.campaignObj = response
        })
        .then((response) => {
          this.saveCampaignMapping(audience);
        })
        .catch((error) => {
          this.actionprocess = "Error when save campain!"
          console.error(error)
        })
    }
  }

  saveCampaignMapping(audience){
      let priority = new Date().getTime() / 1000
      let compaignMappings = this.locations
        .filter((location) => { return location.selected === true })
        .map((location) => {
          return {
            campaignId: this.campaignObj.id,
            campaignName: this.campaignObj.name,
            audience: audience,
            locationId: location.id,
            locationName: location.name,
            kpiPerDay: location.kpi,
            priority: priority
          }
        })
      this.CampaignMapping.createMany(compaignMappings)
        .$promise
        .then((response) => {
          this.actionprocess = "Your booking has been placed!"
        })
        .catch((error) => {
          this.actionprocess = "Error when save campain!"
          console.error(error)
              })
      }
}

export default angular
  .module('campaign.controller', [])
  .controller('CampaignCtrl', CampaignCtrl)
