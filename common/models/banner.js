import { accessifyResource } from '../access-utils';

module.exports = function(Banner) {
  Banner.validatesUniquenessOf('name');

  accessifyResource(Banner, 'BANNER');
};
