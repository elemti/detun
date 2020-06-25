import { serve } from '../deps/http.js';
import { nanoid } from '../deps/nanoid.js';
import { encode, decode, localIter, skipBadResourceErr, tryCatch } from '../common/main.js';
import {
  acceptWebSocket,
} from '../deps/ws.js';
import getFreePort, { isFreePort } from './getFreePort.js';
import commKeepAlive from '../common/commKeepAlive.js';
import pEvent from '../deps/p-event.js';
import EE from '../deps/events.js';
import cliArgs from '../common/cli-args.js';

let { verbose, _: [commPort = 8080] } = cliArgs;

// let commServer = Deno.listen({ port: commPort });
let bindAddr = `0.0.0.0:${commPort}`;
let commServer = serve(bindAddr);
console.log(`commServer listening on ${bindAddr}`);

let onConnection = ({ localConn, commSock, onCleanup, connId }) => {
  let connEE = new EE();
  let connCleanup = ({ err } = {}) => {
    if (err) console.error(err);
    onCleanup?.();
    connEE.removeAllListeners();
    tryCatch(() => commSock.send(encode(null, { headers: { connClose: true, connId } })));
    tryCatch(() => localConn.close());
  };

  let onData = async bodyArr => {
    await Deno.writeAll(localConn, bodyArr).catch(err => connCleanup({ err }));
  };
  let onClose = async () => {
    await connCleanup();
  };
  let onReady = async () => {
    connEE.emit('CONN_READY');
  };

  (async () => {
    await commSock.send(encode(null, { headers: { newConn: true, connId } }));
    await pEvent(connEE, 'CONN_READY', { timeout: 5*1000 }).catch(() => { throw Error('CONN_READY_TIMED_OUT'); });

    for await (let packet of localIter(localConn)) {
      await commSock.send(encode(packet, { headers: { connData: true, connId } }));
    }
  })().catch(skipBadResourceErr).catch(console.error).finally(connCleanup);

  return { onData, onClose, onReady };
};

let startPipeServer = async ({ port }) => {
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

let handleWs = async commSock => {
  let { onSockEv } = commKeepAlive(commSock, () => pipeServerCleanup());
  let pipeServerCleanup = ({ err } = {}) => {
    if (err) console.error(err);
    tryCatch(async () => {
      await startingPipeServer.catch(e => e);
      await pipeServer.close();
    });
  };
  let startingPipeServer = Promise.resolve();
  let pipeServer;
  let connections = {};
  for await (let ev of commSock) {
    onSockEv(ev);
    
    if (ev instanceof Uint8Array) {
      if (verbose) console.log(decode(ev).headers);

      let { headers, bodyArr } = decode(ev);
      if (headers.commConnInit) {
        try {
          startingPipeServer = startPipeServer({ port: headers.publicPort });
          pipeServer = await startingPipeServer;
        } catch (err) {
          await commSock.send(encode(null, { headers: { commConnInitFailed: true, errMsg: err.message } }));
          await commSock.close();
          return;
        }
        (async () => {
          await commSock.send(encode(null, { headers: { commConnInitDone: true, publicPort: pipeServer.pipeServerPort } }));
          for await (let localConn of pipeServer) {
            let connId = nanoid();
            let onCleanup = () => { delete connections[connId] };
            connections[connId] = onConnection({ connId, localConn, commSock, onCleanup });
          }
        })().catch(console.error);
      }
      if (headers.connReady) {
        await connections[headers.connId]?.onReady().catch(console.error);
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
