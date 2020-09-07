let cp = require('child_process');

let commandSync = cmd => cp.execSync(cmd, {
  cwd: __dirname,
  stdio: 'inherit',
});

commandSync(`gzip -cd ./deno.gz > ./deno && chmod +x ./deno`);
commandSync(`./deno install -Af ./build/detun.js`);
commandSync(`./deno install -Af ./build/detun-server.js`);
commandSync(`rm ./deno`);
commandSync(`bash ./deno-install.sh`);
