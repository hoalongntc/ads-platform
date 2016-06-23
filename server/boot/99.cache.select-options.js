import Promise from 'bluebird';

export default (app, cb) => {
  const SelectOption = app.models.SelectOption;
  const optionTypes = [
    'location_category', 'campaign_category', 'city',
    'os_category', 'device_category',
    'age_category', 'gender_category', 'income_category'
  ];

  Promise
    .map(optionTypes, (type) => {
      return SelectOption
        .find({where: {type: type}, fields: {text: 1, value: 1, options: 1}})
        .then(rows => {
          app.set(`SelectOption:${type}`, rows);
        });
    })
    .then(() => cb())
    .catch(err => {
      console.error(err);
      cb();
    });
};
