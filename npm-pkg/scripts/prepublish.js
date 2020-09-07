let cp = require('child_process');
let path = require('path');

let commandSync = cmd => cp.execSync(cmd, {
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit',
});

commandSync(`mkdir -p build && tar -zcv deno-install | base64 > build/deno-install.tgz.b64`);
