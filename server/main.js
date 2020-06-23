import { serve } from '../deps/http.js';
import { nanoid } from '../deps/nanoid.js';
import EE from '../deps/events.js';
import { encode, decode, localIter, skipBadResourceErr } from '../common/main.js';
import pEvent from '../deps/p-events.js';
import {
  acceptWebSocket,
} from '../deps/ws.js';
import getFreePort, { isFreePort } from './getFreePort.js';
import commKeepAlive from '../common/commKeepAlive.js';

let emitter = new EE();
let commPort = parseInt(Deno.args[0]) || 8080;

// let commServer = Deno.listen({ port: commPort });
let bindAddr = `0.0.0.0:${commPort}`;
let commServer = serve(bindAddr);
console.log(`commServer listening on ${bindAddr}`);

let startPipeServer = async ({ publicPort, commSock }) => {
  let onConnection = localConn => {
    let connId = nanoid();

    let connCleanup = ({ err } = {}) => {
      if (err) console.error(err);
      emitter.removeAllListeners(`CONN_DATA:${connId}`);
      emitter.removeAllListeners(`CONN_CLOSE:${connId}`);
      commSock.send(encode(null, { headers: { connClose: true, connId } }));
      try { localConn.close(); } catch {}
    };

    let connDataHandler = bodyArr => {
      localConn.write(bodyArr).catch(err => connCleanup({ err }));
    };
    let connCloseHandler = () => connCleanup();

    (async () => {
      await commSock.send(encode(null, { headers: { newConn: true, connId } }));
      await pEvent(emitter, `CONN_READY:${connId}`, { timeout: 3*1000 });
      emitter.on(`CONN_DATA:${connId}`, connDataHandler);
      emitter.once(`CONN_CLOSE:${connId}`, connCloseHandler);

      for await (let packet of localIter(localConn)) {
        await commSock.send(encode(packet, { headers: { connData: true, connId } }));
      }
    })().catch(skipBadResourceErr).catch(console.error).finally(connCleanup);
  };
  
  try {
    if (publicPort) {
      let isFree = await isFreePort(publicPort);
      if (!isFree) throw Error(`SELECTED_PORT_IS_BUSY: ${publicPort}`);
    } else {
      publicPort = await getFreePort();
    }
  } catch (err) {
    await commSock.send(encode(null, { headers: { commConnInitFailed: true, publicPort, errMsg: err.message } }));
    return;
  }

  let pipeServer = Deno.listen({ port: publicPort });
  console.log('pipeServer created at port ' + publicPort);
  
  (async () => {
    await commSock.send(encode(null, { headers: { commConnInitDone: true, publicPort } }));
    for await (let localConn of pipeServer) {
      onConnection(localConn);
    }
  })().catch(console.error);

  return pipeServer;
};

let handleWs = async commSock => {
  let cleanup = () => {
    try { pipeServer?.close?.(); } catch {}
  };
  let pipeServer;
  let { onSockEv } = commKeepAlive(commSock, cleanup);
  for await (let ev of commSock) {
    onSockEv(ev);
    
    if (ev instanceof Uint8Array) {
      // console.dir(decode(ev));
      console.dir(decode(ev).headers);

      let { headers, bodyArr } = decode(ev);
      if (headers.commConnInit) {
        let { publicPort } = headers;
        pipeServer = await startPipeServer({ publicPort, commSock });
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
    try { req.respond({ status: 400 }); } catch {}
    try { commSock.close(1000); } catch {}
  });
};

(async () => {
  for await (let req of commServer) {
    handleReq(req);
  }
})();
