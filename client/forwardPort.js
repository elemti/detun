import { encode, decode, localIter, tcpConnect, skipBadResourceErr, tryCatch } from '../common/main.js';
import {
  connectWebSocket,
} from '../deps/ws.js';
import commKeepAlive from '../common/commKeepAlive.js';

let pipeNewConnection = ({ connId, localPort, commSock, onCleanup }) => {
  let connCleanup = ({ err } = {}) => {
    if (err) console.error(err);
    onCleanup?.();
    tryCatch(() => commSock.send(encode(null, { headers: { connClose: true, connId } })));
    tryCatch(() => localConn?.close?.());
  };
  let onData = async bodyArr => {
    await Deno.writeAll(localConn, bodyArr).catch(err => connCleanup({ err }));
  };
  let onClose = async () => {
    await connCleanup();
  };
  let localConn;

  (async () => {
    localConn = await tcpConnect({ port: localPort });

    await commSock.send(encode(null, { headers: { connReady: true, connId } }));
    for await (let packet of localIter(localConn)) {
      await commSock.send(encode(packet, { headers: { connData: true, connId } }));
    }
  })().catch(skipBadResourceErr).catch(console.error).finally(connCleanup);

  return { onData, onClose };
};

export default async ({ localPort, publicPort, commPort = 8080, hostname = 'elemti.com' }) => {
  let commSock = await connectWebSocket(`ws://${hostname}:${commPort}`);
  console.log('connected to commServer');

  await commSock.send(encode(null, { headers: { commConnInit: true, publicPort } }));

  let connections = {};
  let { onSockEv } = commKeepAlive(commSock);
  for await (let ev of commSock) {
    onSockEv(ev);
    
    if (ev instanceof Uint8Array) {
      // console.log(decode(ev));
      console.log(decode(ev).headers);

      let { headers, bodyArr } = decode(ev);
      if (headers.commConnInitDone) {
        console.log(`forwarding localhost:${localPort} -> ${hostname}:${headers.publicPort}`);
      }
      if (headers.commConnInitFailed) {
        console.error(`remote host error: ${headers.errMsg}`);
        throw Error('COMM_CONN_INIT_FAILED');
      }
      if (headers.newConn) {
        let { connId } = headers;
        let onCleanup = () => { delete connections[connId] };
        connections[connId] = pipeNewConnection({ connId, localPort, commSock, onCleanup });
      }
      if (headers.connData) {
        await connections[headers.connId]?.onData(bodyArr).catch(console.error);
      }
      if (headers.connClose) {
        await connections[headers.connId]?.onClose().catch(console.error);
      }
    }
  }
};
