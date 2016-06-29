module.exports = function (User) {

  User.prototype.updateRoleMapping = function(forceDelete = false) {
    const models = User.app.models;
    if (this.profileId && !forceDelete) {
      return models.roleMapping
        .destroyAll({principalType: models.roleMapping.USER, principalId: this.id})
        .then(() => models.RoleProfileMapping.find({where: {profileId: this.profileId}}))
        .then(mappings => models.roleMapping.create(mappings.map(map => {
          return {principalType: models.roleMapping.USER, principalId: this.id, roleId: map.roleId};
        })))
        .catch(console.error);
    } else {
      return models.roleMapping
        .destroyAll({principalType: models.roleMapping.USER, principalId: this.id})
        .catch(console.error);
    }
  };

  // Create ResourceGroup
  User.observe('before save', (ctx, next) => {
    if (ctx.instance && ctx.isNewInstance) {
      const {ResourceGroup} = User.app.models;

      ResourceGroup
        .create()
        .then(resourceGroup => {
          ctx.instance.resourceGroupId = resourceGroup.id;
          next();
        })
        .catch(next);
    } else {
      next();
    }
  });

  // Set the username to the users email address by default.
  User.observe('before save', function setDefaultUsername (ctx, next) {
    if (ctx.instance) {
      if (ctx.isNewInstance) {
        ctx.instance.username = ctx.instance.email;
      }
      ctx.instance.status = 'created';
    }
    next();
  });

  // Update role mapping
  User.observe('after save', (ctx, next) => {
    if (ctx.instance) {
      ctx.instance
        .updateRoleMapping()
        .then(() => next())
        .catch(err => {
          console.error(err);
          next();
        });
    } else {
      next();
    }
  });

  // Remove role mapping
  User.observe('before delete', (ctx, next) => {
    if (ctx.instance) {
      ctx.instance
        .updateRoleMapping(true)
        .then(() => next())
        .catch(err => {
          console.error(err);
          next();
        });
    } else {
      next();
    }
  });
};
