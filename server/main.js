import { serve } from '../deps/http.js';
import { nanoid } from '../deps/nanoid.js';
import EE from '../deps/events.js';
import { encode, decode, localIter, skipBadResourceErr, tryCatch } from '../common/main.js';
import pEvent from '../deps/p-events.js';
import {
  acceptWebSocket,
} from '../deps/ws.js';
import getFreePort, { isFreePort } from './getFreePort.js';
import commKeepAlive from '../common/commKeepAlive.js';

let commPort = parseInt(Deno.args[0]) || 8080;

// let commServer = Deno.listen({ port: commPort });
let bindAddr = `0.0.0.0:${commPort}`;
let commServer = serve(bindAddr);
console.log(`commServer listening on ${bindAddr}`);

let startPipeServer = async ({ publicPort, commSock, commEE }) => {
  let commClosed = false;
  let pipeServerCleanup = ({ err } = {}) => {
    commClosed = true;
    if (err) console.error(err);
    try { pipeServer?.close?.(); } catch {}
  };
  let onConnection = localConn => {
    let connId = nanoid();

    let connCleanup = ({ err } = {}) => {
      if (err) console.error(err);
      commEE.off(`CONN_DATA:${connId}`, connDataHandler);
      commEE.off(`CONN_CLOSE:${connId}`, connCloseHandler);
      tryCatch(() => commSock.send(encode(null, { headers: { connClose: true, connId } })));
      tryCatch(() => localConn.close());
    };

    let connDataHandler = bodyArr => {
      Deno.writeAll(localConn, bodyArr).catch(err => connCleanup({ err }));
    };
    let connCloseHandler = () => {
      connCleanup();
    };

    (async () => {
      await commSock.send(encode(null, { headers: { newConn: true, connId } }));
      await pEvent(commEE, `CONN_READY:${connId}`, { timeout: 3*1000 }).catch(() => { throw Error('CONN_READY_TIMED_OUT'); });
      commEE.on(`CONN_DATA:${connId}`, connDataHandler);
      commEE.on(`CONN_CLOSE:${connId}`, connCloseHandler);

      for await (let packet of localIter(localConn)) {
        await commSock.send(encode(packet, { headers: { connData: true, connId } }));
      }
    })().catch(skipBadResourceErr).catch(console.error).finally(connCleanup);
  };
  
  commEE.once('COMM_CONN_CLOSE', () => pipeServerCleanup());
  let pipeServer;
  try {
    if (publicPort) {
      let isFree = await isFreePort(publicPort);
      if (!isFree) throw Error(`SELECTED_PORT_IS_BUSY: ${publicPort}`);
    } else {
      publicPort = await getFreePort();
    }
    if (commClosed) return;
    pipeServer = Deno.listen({ port: publicPort });
    console.log('pipeServer created at port ' + publicPort);
  } catch (err) {
    await commSock.send(encode(null, { headers: { commConnInitFailed: true, publicPort, errMsg: err.message } }));
    return;
  }
  
  (async () => {
    await commSock.send(encode(null, { headers: { commConnInitDone: true, publicPort } }));
    for await (let localConn of pipeServer) {
      onConnection(localConn);
    }
  })().catch(console.error);
};

let handleWs = async commSock => {
  let commEE = new EE();
  let { onSockEv } = commKeepAlive(commSock, () => commEE.emit(`COMM_CONN_CLOSE`));
  for await (let ev of commSock) {
    onSockEv(ev);
    
    if (ev instanceof Uint8Array) {
      // console.log(decode(ev));
      console.log(decode(ev).headers);

      let { headers, bodyArr } = decode(ev);
      if (headers.commConnInit) {
        let { publicPort } = headers;
        startPipeServer({ publicPort, commSock, commEE }).catch(console.error);
      }
      if (headers.connReady) {
        commEE.emit(`CONN_READY:${headers.connId}`);
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

let handleReq = req => {
  let { conn, r: bufReader, w: bufWriter, headers } = req;
  let commSock;
  (async () => {
    commSock = await acceptWebSocket({ conn, bufReader, bufWriter, headers });
    await handleWs(commSock);
  })().catch(err => {
    console.error(err);
    tryCatch(() => req.respond({ status: 400 }))
    tryCatch(() => commSock.close(1000))
  });
};

(async () => {
  for await (let req of commServer) {
    handleReq(req);
  }
})();
