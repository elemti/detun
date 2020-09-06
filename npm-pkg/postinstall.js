let cp = require('child_process');

let command = cmd => cp.execSync(cmd, {
  cwd: __dirname,
  stdio: 'inherit',
});

command(`deno install -Af ./build/detun.js`);
command(`deno install -Af ./build/detun-server.js`);
