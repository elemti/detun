import { serve } from '../deps/http.js';
import { nanoid } from '../deps/nanoid.js';
import EE from '../deps/events.js';
import { encode, decode, localIter, skipBadResourceErr } from '../common/main.js';
import pEvent from '../deps/p-events.js';
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  isWebSocketPingEvent,
} from '../deps/ws.js';

let emitter = new EE();
let COMM_PORT = 8000;

// let commServer = Deno.listen({ port: COMM_PORT });
let commServer = serve(`:${COMM_PORT}`);
console.log(`commServer listening on port ${COMM_PORT}`);

let startPipeServer = async ({ publicPort, commSock }) => {
  let pipeServer = Deno.listen({ port: publicPort });
  console.log('pipeServer created at port ' + publicPort);

  let onConnection = localConn => {
    let connId = nanoid();

    let connCleanup = ({ err } = {}) => {
      if (err) console.error(err);
      emitter.off(`CONN_DATA:${connId}`, connDataHandler);
      emitter.off(`CONN_CLOSE:${connId}`, connCloseHandler);
      commSock.send(encode(null, { headers: { connClose: true, connId } }));
      try { localConn.close(); } catch {}
    };

    let connDataHandler = bodyArr => {
      localConn
        .write(bodyArr)
        .catch(err => connCleanup({ err }));
    };
    let connCloseHandler = () => connCleanup();

    (async () => {
      await commSock.send(encode(null, { headers: { newConn: true, connId } }));
      await pEvent(emitter, `CONN_READY:${connId}`, { timeout: 3*1000 });
      emitter.on(`CONN_DATA:${connId}`, connDataHandler);
      emitter.once(`CONN_CLOSE:${connId}`, connCloseHandler);

      for await (let packet of localIter(localConn)) {
        await commSock
          .send(encode(packet, { headers: { connData: true, connId } }))
          .catch(err => connCleanup({ err }));
      }
    })().catch(skipBadResourceErr).catch(console.error).finally(connCleanup);
  };

  for await (let localConn of pipeServer) {
    onConnection(localConn);
  }
};

let handleWs = async commSock => {
  console.log('client connected');

  for await (let ev of commSock) {
    if (typeof ev === 'string') {
      // text message
      console.log("ws:Text", ev);
    }
    
    if (ev instanceof Uint8Array) {
      // console.log(decode(ev));
      console.log(decode(ev).headers);

      let { headers, bodyArr } = decode(ev);
      if (headers.commConnInit) {
        let { publicPort } = headers;
        if (!publicPort) {
          // todo: get free port
        }
        startPipeServer({ publicPort, commSock }).catch(console.error);
      }
      if (headers.connReady) {
        emitter.emit(`CONN_READY:${headers.connId}`);
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

let handleReq = req => {
  let { conn, r: bufReader, w: bufWriter, headers } = req;
  let commSock;
  (async () => {
    commSock = await acceptWebSocket({ conn, bufReader, bufWriter, headers });
    await handleWs(commSock);
  })().catch(err => {
    console.error(`failed to accept websocket: ${err}`);
    req.respond({ status: 400 });
    commSock?.close?.(1000);
  });
};

(async () => {
  for await (let req of commServer) {
    handleReq(req);
  }
})();
