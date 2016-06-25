import Promise from 'bluebird';

module.exports = function(RoleProfileMapping) {

  RoleProfileMapping.observe('after save', (ctx, next) => {
    if (ctx.instance && ctx.isNewInstance) {
      const models = RoleProfileMapping.app.models;

      models.user
        .find({where: {profileId: ctx.instance.profileId}})
        .then(users => {
          return Promise.map(users, user => {
            return models.roleMapping.create({principalType: models.roleMapping.USER, principalId: user.id, roleId: ctx.instance.roleId});
          });
        })
        .then(console.log)
        .then(next)
        .catch(err => {
          console.error(err);
          next();
        });
    }
  });

  RoleProfileMapping.observe('after delete', (ctx, next) => {
    if (ctx.instance) {
      const models = RoleProfileMapping.app.models;

      Promise
        .all([
          models.role.findById(ctx.instance.roleId),
          models.Profile.findById(ctx.instance.profileId, {include: 'users'})
        ])
        .then(([role, profile]) => {
          return Promise.map(profile.users, user => {
            return models.roleMapping.destroyAll({principalType: models.roleMapping.USER, principalId: user.id, roleId: role.id});
          });
        })
        .then(console.log)
        .then(next)
        .catch(err => {
          console.error(err);
          next();
        });
    }
  });
};
