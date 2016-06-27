import loopback from 'loopback';
const app = require('../server');

export default () => {
  const setCurrentUser = (req, res, next) => {
    const ctx = loopback.getCurrentContext();

    app.models.accessToken.findForRequest(req, (err, accessToken) => {
      if (accessToken) {
        app.models.user
          .findById(accessToken.userId, {fields: {groupId: 1, groupName: 1}})
          .then(user => {
            ctx.set('currentUserId', accessToken.userId);
            ctx.set('currentGroupId', user.groupId);
            ctx.set('currentGroupId', user.groupName);
            next();
          })
          .catch(next);
      } else {
        next();
      }
    });
  };

  return setCurrentUser;
};
