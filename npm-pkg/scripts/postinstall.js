let cp = require('child_process');
let path = require('path');

let commandSync = cmd => cp.execSync(cmd, {
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit',
});

commandSync(`deno install -Af ./build/detun.js`);
commandSync(`deno install -Af ./build/detun-server.js`);
