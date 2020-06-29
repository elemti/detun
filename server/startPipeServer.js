import getFreePort, { isFreePort } from './getFreePort.js';

export default async ({ port }) => {
  if (port) {
    let isFree = await isFreePort(port);
    if (!isFree) throw Error(`SELECTED_PORT_IS_BUSY: ${port}`);
  } else {
    port = await getFreePort();
  }
  let pipeServer = Deno.listen({ port });
  console.log('pipeServer created at port ' + port);
  return Object.assign(pipeServer, { pipeServerPort: port });
};
