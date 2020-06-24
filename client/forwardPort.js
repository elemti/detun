import { encode, decode, localIter, tcpConnect, skipBadResourceErr, tryCatch } from '../common/main.js';
import EE from '../deps/events.js';
import {
  connectWebSocket,
} from '../deps/ws.js';
import commKeepAlive from '../common/commKeepAlive.js';

let pipeNewConnection = ({ connId, localPort, commSock, commEE }) => {
  let connCleanup = ({ err } = {}) => {
    if (err) console.error(err);
    commEE.off(`CONN_DATA:${connId}`, connDataHandler);
    commEE.off(`CONN_CLOSE:${connId}`, connCloseHandler);
    tryCatch(() => commSock.send(encode(null, { headers: { connClose: true, connId } })));
    tryCatch(() => localConn?.close?.());
  };
  let connDataHandler = bodyArr => {
    Deno.writeAll(localConn, bodyArr).catch(err => connCleanup({ err }));
  };
  let connCloseHandler = () => {
    connCleanup();
  };
  let localConn;

  (async () => {
    localConn = await tcpConnect({ port: localPort });
    commEE.on(`CONN_DATA:${connId}`, connDataHandler);
    commEE.on(`CONN_CLOSE:${connId}`, connCloseHandler);

    await commSock.send(encode(null, { headers: { connReady: true, connId } }));
    for await (let packet of localIter(localConn)) {
      await commSock.send(encode(packet, { headers: { connData: true, connId } }));
    }
  })().catch(skipBadResourceErr).catch(console.error).finally(connCleanup);
};

export default async ({ localPort, publicPort, commPort = 8080, hostname = 'elemti.com' }) => {
  let commSock = await connectWebSocket(`ws://${hostname}:${commPort}`);
  console.log('connected to commServer');

  await commSock.send(encode(null, { headers: { commConnInit: true, publicPort } }));

  let commEE = new EE();
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
        console.error(`forward failed localhost:${localPort} -> ${hostname}:${headers.publicPort}`);
        console.error(`remote host error: ${headers.errMsg}`);
        throw Error('COMM_CONN_INIT_FAILED');
      }
      if (headers.newConn) {
        let { connId } = headers;
        pipeNewConnection({ connId, localPort, commSock, commEE });
      }
      if (headers.connData) {
        commEE.emit(`CONN_DATA:${headers.connId}`, bodyArr);
      }
      if (headers.connClose) {
        commEE.emit(`CONN_CLOSE:${headers.connId}`);
      }
    }
  }
};
