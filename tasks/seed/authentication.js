import lodash from 'lodash';
import Promise from 'bluebird';

const debug = require('debug')('seed:authentication');

export default function(app) {
  const models = app.models;
  const authenticationInfo = require('./authentication.json');

  return Promise
    .all([
      Promise.map(authenticationInfo.roles, role => {
        return models.role.create(role);
      }),
      Promise.map(authenticationInfo.users, user => {
        return models.user.create(user);
      }),
      Promise.map(authenticationInfo.menus, menu => {
        return models.Menu.create(menu);
      })
    ])
    .then(([roles, users, menus]) => {
      debug('Roles', roles);
      debug('Users', users);
      debug('Menus', menus);

      return Promise
        .all([
          Promise.map(lodash.cloneDeep(users), (user, index) => {
            return models.roleMapping.create({principalId: users[index].id, principalType: models.roleMapping.USER, roleId: roles[index].id});
          }),
          Promise.map(lodash.cloneDeep(roles), role => {
            return models.RoleMenuMapping.create(lodash.cloneDeep(menus).map(menu => {
              return {menuId: menu.id, menuName: menu.name, roleId: role.id, roleName: role.name}
            }));
          })
        ]);
    })
    .then(([roleMappings, menuMappings]) => {
      debug('Role Mappings', roleMappings);
      debug('Menu Mappings', menuMappings);
    })
    .catch(err => {
      console.error(err);
    });
}
