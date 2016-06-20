module.exports = function (shipit) {
  require('shipit-deploy')(shipit);
  require('shipit-npm')(shipit);
  require('shipit-shared')(shipit);

  const APP_NAME = 'ads-platform';
  const APP_DEPLOY_TO = `/var/www/${APP_NAME}`;
  
  shipit.initConfig({
    default: {
      workspace: `/tmp/${APP_NAME}`,
      deployTo: `/var/www/${APP_NAME}`,
      repositoryUrl: 'git@gitlab.com:hoalongntc/ads-platform.git',
      ignores: ['.git', 'node_modules'],
      rsync: ['--del'],
      keepReleases: 2,
      shallowClone: true,

      npm: {
        remote: true
      },

      shared: {
        overwrite: true,
        chmod: '755',
        files: [
          'server/datasources.json'
        ]
      }
    },
    staging: {
      servers: 'adsplatform@112.109.90.105:2022',
      branch: 'tracking'
    }
  });

  shipit.blTask('build', function () {
    shipit.remote(`cd "${APP_DEPLOY_TO}/current" && npm run build`).then(function (res) {
      console.log(res[0].stdout);
      console.log(res[0].stderr);
    });
  });

  shipit.on('npm_installed', function () {
    shipit.start('build');
  });
};
