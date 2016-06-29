import loopback from 'loopback';
import mongo from 'mongodb';

const creator = (Model, options) => {
  Model.defineProperty('createdBy', {type: id => mongo.ObjectId(id.toString())});
  Model.defineProperty('createdByUsername', {type: String});
  Model.defineProperty('updatedBy', {type: id => mongo.ObjectId(id.toString())});
  Model.defineProperty('updatedByUsername', {type: String});

  Model.observe('before save', function event(ctx, next) {
    const context = loopback.getCurrentContext();
    if (!context) {
      return next();
    }

    if (ctx.instance && ctx.isNewInstance && !ctx.instance.createdBy) {
      ctx.instance.createdBy = context.get('currentUserId');
      ctx.instance.createdByUsername = context.get('currentUsername');
    }
    if (ctx.instance) {
      ctx.instance.updatedBy = context.get('currentUserId');
      ctx.instance.updatedByUsername = context.get('currentUsername');
    } else if (ctx.data) {
      ctx.data.updatedBy = context.get('currentUserId');
      ctx.data.updatedByUsername = context.get('currentUsername');
    }
    next();
  });
};

export default creator;
