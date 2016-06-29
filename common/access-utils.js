import loopback from 'loopback';

const accessifyResource = (Resource, resourceType) => {
  Resource.observe('after save', (ctx, next) => {
    const {ResourceMapping, Profile} = Resource.app.models;

    if (ctx.instance && ctx.isNewInstance) {
      const context = loopback.getCurrentContext();
      if (!context) {
        return next();
      }
      if (context.get('currentProfileName') === Profile.ADMIN) {
        return next();
      }
      const currentResourceGroupId = context.get('currentResourceGroupId');

      ResourceMapping
        .create({
          resourceType: resourceType,
          resourceId: ctx.instance.id, resourceGroupId: currentResourceGroupId
        })
        .then(() => next())
        .catch(next);
    } else {
      next();
    }
  });

  Resource.observe('before delete', (ctx, next) => {
    if (ctx.where) {
      const {ResourceMapping} = Resource.app.models;

      Resource
        .find({where: ctx.where}, {fields: {id: 1}})
        .then(objs => objs.map(b => b.id.toString()))
        .then(objIds => {
          return ResourceMapping.destroyAll({resourceId: {inq: objIds}});
        })
        .then(() => next())
        .catch(next);
    }
  });

  Resource.observe('access', (ctx, next) => {
    const {ResourceMapping, Profile} = Resource.app.models;
    const context = loopback.getCurrentContext();
    if (!context) {
      return next();
    }
    const currentProfile = context.get('currentProfileName');
    if (currentProfile === Profile.ADMIN) {
      return next();
    }
    if (typeof Resource.allow == 'function' && Resource.allow(currentProfile, ctx)) {
      return next();
    }
    const currentResourceGroupId = context.get('currentResourceGroupId');

    const resourceWhere = {resourceType: resourceType, resourceGroupId: currentResourceGroupId};
    if (ctx.query && ctx.query.where && ctx.query.where.id) {
      if (typeof ctx.query.where.id == 'string') {
        resourceWhere.resourceId = ctx.query.where.id;
      } else if (Array.isArray(ctx.query.where.id)) {
        resourceWhere.resourceId = {inq: ctx.query.where.id};
      }
    }

    ResourceMapping
      .getResources(resourceWhere)
      .then(resourceIds => {
        if (!ctx.query.where) {
          ctx.query.where = {};
        }
        ctx.query.where.id = {inq: resourceIds};
        next();
      })
      .catch(next);
  });
};

export {
  accessifyResource
};
