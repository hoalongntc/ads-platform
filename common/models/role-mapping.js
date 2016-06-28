module.exports = function(RoleMapping) {
  RoleMapping.defineProperty('principalId', {type: id => require('mongodb').ObjectId(id.toString())});
};
