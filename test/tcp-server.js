let tcpServer = Deno.listen({ port: 8080 });

// setInterval(() => console.log(Deno.resources()), 500);
(async () => {
  for await (let conn of tcpServer) {
    console.log({ conn, connClose: conn.close });
    await new Promise(res => setTimeout(res, 1000));
    conn.closeWrite();
    conn.close();
    try {
      for await (let packet of Deno.iter(conn)) {
        console.log({ packet });
        // await new Promise(res => setTimeout(res, 5000));
        // await conn.write(new TextEncoder().encode('hey'));
        // console.log('written');
      }
    } catch {}
    console.log('done');
  }

})();
