import lodash from 'lodash';
import Promise from 'bluebird';

const debug = require('debug')('seed:authentication');

export default function(app) {
  const models = app.models;
  const authenticationInfo = require('./authentication.json');

  return Promise
    .all([
      Promise.map(authenticationInfo.profiles, profile => {
        return models.Profile.create(profile);
      }),
      Promise.map(authenticationInfo.users, user => {
        return models.user.create(user);
      })
    ])
    .then(([profiles, users]) => {
      debug('Profiles', profiles);
      debug('Users', users);

      return Promise
        .map(lodash.cloneDeep(users), (user, index) => {
          return user.updateAttributes({profileId: profiles[index].id, profileName: profiles[index].name});
        });
    })
    .then(() => Promise.all([
      Promise.map(authenticationInfo.roles, role => {
        return models.role.create(role);
      }),
      Promise.map(authenticationInfo.menus, menu => {
        return models.Menu.create(menu);
      })
    ]))
    .then(([roles, menus]) => {
      debug('Roles', roles);

      return Promise.map(authenticationInfo.roleProfileMappings, map => Promise
        .all([
          models.Profile.findOne({where: {name: map.profileName}}),
          models.role.findOne({where: {name: map.roleName}})
        ])
        .then(([profile, role]) => {
          return models.RoleProfileMapping.create({
            roleId: role.id, roleName: role.name,
            profileId: profile.id, proileName: profile.name
          });
        })
      );
    })
    .then((roleMappings) => {
      debug('Role Mappings', roleMappings);
    })
    .catch(err => {
      console.error(err);
    });
}
