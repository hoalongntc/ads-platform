import Promise from 'bluebird';

const debug = require('debug')('seed:authentication');

export default function(app) {
  const models = app.models;
  const authenticationInfo = require('./authentication.json');

  return Promise
    .all([
      Promise.map(authenticationInfo.profiles, profile => {
        return models.Profile.create(profile).catch(err => { console.error('1', err) });
      }),
      Promise.map(authenticationInfo.users, user => {
        return models.user.create(user).catch(err => { console.error('2', err) });
      })
    ])
    .then(([profiles, users]) => {
      debug('Profiles', profiles);
      debug('Users', users);

      return Promise
        .map(users, (user, index) => {
          return user.updateAttributes({profileId: profiles[index].id, profileName: profiles[index].name}).catch(err => { console.error('3', err) });
        });
    })
    .then(() => Promise.all([
      Promise.map(authenticationInfo.roles, role => {
        return models.role.create(role).catch(err => { console.error('4', err) });
      }),
      Promise.map(authenticationInfo.menus, menu => {
        return models.Menu.create(menu).catch(err => { console.error('5', err) });
      })
    ]))
    .then(([roles, menus]) => {
      debug('Roles', roles);

      return Promise.map(authenticationInfo.roleProfileMappings, map => Promise
        .all([
          models.Profile.findOne({where: {name: map.profileName}}).catch(err => { console.error('6', err) }),
          models.role.findOne({where: {name: map.roleName}}).catch(err => { console.error('7', err) })
        ])
        .then(([profile, role]) => {
          return models.RoleProfileMapping.create({
            roleId: role.id, roleName: role.name,
            profileId: profile.id, profileName: profile.name
          }).catch(err => { console.error('8', err) });
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
