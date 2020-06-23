var path = require('path');

var remoteDir = '/home/elemti/detun';
let serviceName = 'detun-server';

module.exports = shipit => {
  var dirName = path.basename(__dirname);
  shipit.initConfig({
    all: {
      servers: [
        'elemti@elemti.com',
      ],
    },
  });

  shipit.blTask('default', ['deploy', 'install', 'restart']);

  shipit.task('gitfastpush', async () => {
    await shipit.local(`
      cd ${__dirname};
      git add .;
      git commit -am 'gitfastpush';
      git push;
    `);
  });
  shipit.blTask('deploy', async () => {
    await shipit.copyToRemote(
      path.join(__dirname, '.git'),
      remoteDir,
      {
        rsync: '--delete',
        // ignores: ['.git', '.DS_Store', 'node_modules', '.env'],
      },
    );
    await shipit.remote(`
      cd ${remoteDir};
      git reset --hard HEAD;
      git clean -fd;
    `);
  });
  shipit.blTask('install', async () => await shipit.remote(`cd ${remoteDir} && npm i && npm i -g`));
  shipit.blTask('restart', async () => {
    await shipit.remote(`
      cd ${remoteDir};
      pm2 -s delete ${serviceName};
      pm2 start --time --name ${serviceName} detun-server -- start
      pm2 -s save;
      pm2 list;
    `);
  });
};
