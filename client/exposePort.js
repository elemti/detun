import { encode, decode, localIter, tcpConnect, skipBadResourceErr } from '../common/main.js';
import EE from '../deps/events.js';
import {
  connectWebSocket,
  isWebSocketCloseEvent,
  isWebSocketPingEvent,
} from '../deps/ws.js';

let emitter = new EE();
let COMM_PORT = 8000;

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

export default async (localPort, publicPort) => {
  if (isNaN(localPort)) throw Error('invalid localPort: ' + localPort);
  
  let commSock = await connectWebSocket(`ws://127.0.0.1:${COMM_PORT}`);
  console.log('connected to commServer');

  await commSock.send(encode(null, { headers: { commConnInit: true, publicPort } }));

  for await (let ev of commSock) {
    if (typeof ev === 'string') {
      // text message
      console.log("ws:Text", ev);
    }
    
    if (ev instanceof Uint8Array) {
      // console.log(decode(ev));
      console.log(decode(ev).headers);

      let { headers, bodyArr } = decode(ev);
      if (headers.commConnInitDone) {
        console.log(`forwarding localhost:${localPort} -> :${headers.publicPort}`);
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

    if (isWebSocketPingEvent(ev)) {
      let [, body] = ev;
      // ping
      console.log("ws:Ping", body);
    }
    
    if (isWebSocketCloseEvent(ev)) {
      // close
      let { code, reason } = ev;
      console.log("ws:Close", code, reason);
    }
  }
};
