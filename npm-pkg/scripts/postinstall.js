let cp = require('child_process');
let path = require('path');

let commandSync = cmd => cp.execSync(cmd, {
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit',
});

let deno = `./deno-install/deno`;

commandSync(`base64 -d build/deno-install.tgz.b64 | tar xzv`);
commandSync(`chmod +x ${deno}`);
commandSync(`${deno} install -Af ./build/detun.js`);
commandSync(`${deno} install -Af ./build/detun-server.js`);
commandSync(`bash ./deno-install/install.sh`);
