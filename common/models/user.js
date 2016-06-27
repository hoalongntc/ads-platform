import Promise from 'bluebird';

module.exports = function (User) {

  User.prototype.updateRoleMapping = () => {
    const models = User.app.models;

    if (this.profileId) {
      return models.roleMapping
        .destroyAll({principalType: models.roleMapping.USER, principalId: this.id})
        .then(() => models.RoleProfileMapping.find({where: {profileId: this.profileId}}))
        .then(mappings => models.roleMapping.create(mappings.map(map => {
          return {principalType: models.roleMapping.USER, principalId: this.id, roleId: map.roleId}
        })))
        .then(console.log)
        .catch(console.error);
    } else {
      return models.roleMapping
        .destroyAll({principalType: models.roleMapping.USER, principalId: this.id});
    }
  };

  // Set the username to the users email address by default.
  User.observe('before save', function setDefaultUsername (ctx, next) {
    if (ctx.instance) {
      if (ctx.isNewInstance) {
        ctx.instance.username = ctx.instance.email;
      }
      ctx.instance.status = 'created';
      ctx.instance.created = Date.now();
    }
    next();
  });

  // User.afterRemote('findById', (ctx, user, next) => {
  //   const models = User.app.models;
  //   const currentUserId = ctx.req.accessToken.userId.toString();
  //   if (currentUserId && user && currentUserId == user.id.toString()) {
  //     const getRoles = Promise.promisify(models.role.getRoles, {context: models.role});
  //
  //     getRoles({principalType: models.roleMapping.USER, principalId: currentUserId})
  //       .then(roles => Promise.filter(roles, role => role.toString().indexOf('$') == -1))
  //       .then(roleIds => Promise.map(roleIds, roleId => models.role.findById(roleId)))
  //       .then(roles => {
  //         console.log(roles);
  //         ctx.result.roles = roles;
  //         next();
  //       })
  //       .catch(err => {
  //         console.error(err);
  //         next();
  //       });
  //   } else {
  //     next();
  //   }
  // });
};
