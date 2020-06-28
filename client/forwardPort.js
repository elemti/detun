import { localIter, tcpConnect, skipBadResourceErr, tryCatch } from '../common/main.js';
import { encode123, decode123 } from '../common/crypt.js';
import {
  connectWebSocket,
} from '../deps/ws.js';
import commKeepAlive from '../common/commKeepAlive.js';
import { parse } from '../deps/flags.js';

let { verbose } = parse(Deno.args);

let pipeNewConnection = ({ connId, localPort, commSock, onCleanup }) => {
  let connCleanup = ({ err } = {}) => {
    if (err) console.error(err);
    onCleanup?.();
    tryCatch(() => commSock.send(encode123({ connClose: true, connId })));
    tryCatch(async () => {
      await startingLocalConn.catch(e => e);
      await localConn.close();
    });
  };
  let onData = async bodyArr => {
    await Deno.writeAll(localConn, bodyArr).catch(err => connCleanup({ err }));
  };
  let onClose = async () => {
    await connCleanup();
  };
  let localConn;
  let startingLocalConn = Promise.resolve();

  (async () => {
    startingLocalConn = tcpConnect({ port: localPort });
    localConn = await startingLocalConn;

    await commSock.send(encode123({ connReady: true, connId }));
    for await (let packet of localIter(localConn)) {
      await commSock.send(encode123({ packet, connData: true, connId }));
    }
  })().catch(skipBadResourceErr).catch(console.error).finally(connCleanup);

  return { onData, onClose };
};

export default async ({ localPort, publicPort, commPort = 8080, hostname = 'elemti.com' }) => {
  let commSock = await connectWebSocket(`ws://${hostname}:${commPort}`);
  console.log('connected to commServer');

  await commSock.send(encode123({ commConnInit: true, publicPort }));

  let connections = {};
  let { onSockEv } = commKeepAlive(commSock);
  for await (let ev of commSock) {
    onSockEv(ev);
    
    if (ev instanceof Uint8Array) {
      let payload = decode123(ev);
      if (verbose) console.log(payload);

      if (payload.commConnInitDone) {
        console.log(`forwarding localhost:${localPort} -> ${hostname}:${payload.publicPort}`);
      }
      if (payload.commConnInitFailed) {
        console.error(`remote host error: ${payload.errMsg}`);
        throw Error('COMM_CONN_INIT_FAILED');
      }
      if (payload.newConn) {
        let { connId } = payload;
        let onCleanup = () => { delete connections[connId] };
        connections[connId] = pipeNewConnection({ connId, localPort, commSock, onCleanup });
      }
      if (payload.connData) {
        await connections[payload.connId]?.onData(payload.packet).catch(console.error);
      }
      if (payload.connClose) {
        await connections[payload.connId]?.onClose().catch(console.error);
      }
    }
  }
};
