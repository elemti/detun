import { encode, decode, localIter, tcpConnect, skipBadResourceErr } from '../common/main.js';
import EE from '../deps/events.js';
import {
  connectWebSocket,
} from '../deps/ws.js';
import commKeepAlive from '../common/commKeepAlive.js';

let emitter = new EE();

let pipeNewConnection = ({ connId, localPort, commSock }) => {
  let cleanup = ({ err } = {}) => {
    if (err) console.error(err);
    emitter.removeAllListeners(`CONN_DATA:${connId}`);
    emitter.removeAllListeners(`CONN_CLOSE:${connId}`);
    commSock.send(encode(null, { headers: { connClose: true, connId } }));
    try { localConn?.close?.(); } catch {}
  };
  let connDataHandler = bodyArr => {
    localConn.write(bodyArr).catch(err => cleanup({ err }));
  };
  let connCloseHandler = () => cleanup();
  let localConn;

  (async () => {
    localConn = await tcpConnect({ port: localPort });
    emitter.on(`CONN_DATA:${connId}`, connDataHandler);
    emitter.on(`CONN_CLOSE:${connId}`, connCloseHandler);

    await commSock.send(encode(null, { headers: { connReady: true, connId } }));
    for await (let packet of localIter(localConn)) {
      await commSock.send(encode(packet, { headers: { connData: true, connId } }));
    }
  })().catch(skipBadResourceErr).catch(console.error).finally(cleanup);
};

export default async ({ localPort, publicPort, commPort = 8080, hostname = 'elemti.com' }) => {
  let commSock = await connectWebSocket(`ws://${hostname}:${commPort}`);
  console.log('connected to commServer');

  await commSock.send(encode(null, { headers: { commConnInit: true, publicPort } }));

  let { onSockEv } = commKeepAlive(commSock);
  for await (let ev of commSock) {
    onSockEv(ev);
    
    if (ev instanceof Uint8Array) {
      // console.dir(decode(ev));
      console.dir(decode(ev).headers);

      let { headers, bodyArr } = decode(ev);
      if (headers.commConnInitDone) {
        console.log(`forwarding localhost:${localPort} -> :${headers.publicPort}`);
      }
      if (headers.commConnInitFailed) {
        console.error(`forward failed localhost:${localPort} -> :${headers.publicPort}`);
        throw Error(headers.errMsg);
      }
      if (headers.newConn) {
        let { connId } = headers;
        pipeNewConnection({ connId, localPort, commSock });
      }
      if (headers.connData) {
        emitter.emit(`CONN_DATA:${headers.connId}`, bodyArr);
      }
      if (headers.connClose) {
        emitter.emit(`CONN_CLOSE:${headers.connId}`);
      }
    }
  }
};
