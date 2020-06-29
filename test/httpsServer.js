import { serveTLS } from '../deps/http.js';


let commServer = serveTLS({ port: 4433, certFile: "./certs/mydomain.com.crt", keyFile: "./certs/mydomain.com.key" });
console.log(`commServer listening on 4433`);

(async () => {
  for await (let req of commServer) {
    console.log(req);
    req.respond({ status: 200 });
  }
})();

(async () => {
  const conn = await Deno.connectTls({ certFile: "./certs/rootCA.crt", hostname: "localhost", port: 4433});
  console.log(conn);
})();
