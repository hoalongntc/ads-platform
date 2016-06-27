import loopback from 'loopback';

const accessifyResource = (Resource, resourceType) => {
  Resource.observe('after save', (ctx, next) => {
    const ResourceMapping = Resource.app.models.ResourceMapping;

    if (ctx.instance && ctx.isNewInstance) {
      const context = loopback.getCurrentContext();
      const currentGroupName = context.get('currentGroupName');
      if (currentGroupName === 'admin') {
        return next();
      }
      const currentGroupId = context.get('currentGroupId');
      
      ResourceMapping
        .create({
          resourceType: resourceType,
          resourceId: ctx.instance.id, groupId: currentGroupId
        })
        .then(() => next())
        .catch(next);
    } else {
      next();
    }
  });

  Resource.observe('before delete', (ctx, next) => {
    if (ctx.where) {
      const ResourceMapping = Resource.app.models.ResourceMapping;

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
    const ResourceMapping = Resource.app.models.ResourceMapping;
    const context = loopback.getCurrentContext();
    const currentGroupName = context.get('currentGroupName');
    if (currentGroupName === 'admin') {
      return next();
    }
    const currentGroupId = context.get('currentGroupId');


    const resourceWhere = {resourceType: resourceType, groupId: currentGroupId};
    if (ctx.query && ctx.query.where && ctx.query.where.id) {
      if (typeof ctx.query.where.id == 'string') {
        resourceWhere.resourceId = ctx.query.where.id;
      } else if (Array.isArray(ctx.query.where.id)) {
        resourceWhere.resourceId = {inq: ctx.query.where.id};
      }
    }

    ResourceMapping
      .getResources({resourceType: resourceType, groupId: currentGroupId})
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
}
