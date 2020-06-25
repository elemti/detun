rm -vf build/client.js build/server.js
deno bundle client/main.js build/client.js
deno bundle server/main.js build/server.js
