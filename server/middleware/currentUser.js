import loopback from 'loopback';
const app = require('../server');

export default () => {
  const setCurrentUser = (req, res, next) => {
    const ctx = loopback.getCurrentContext();

    app.models.accessToken.findForRequest(req, (err, accessToken) => {
      if (accessToken) {
        app.models.user
          .findById(accessToken.userId, {fields: {email: 1, username: 1, profileId: 1, profileName: 1, resourceGroupId: 1}})
          .then(user => {
            ctx.set('currentUserId', accessToken.userId);
            ctx.set('currentUserEmail', user.email);
            ctx.set('currentUsername', user.username);
            ctx.set('currentProfileId', user.profileId);
            ctx.set('currentProfileName', user.profileName);
            ctx.set('currentResourceGroupId', user.resourceGroupId);
            next();
          })
          .catch(next);
      } else if (err) {
        next(err);
      } else {
        next();
      }
    });
  };

  return setCurrentUser;
};
