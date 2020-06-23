import debounce from '../deps/debounce.js';
import { PING_TIMEOUT, PING_INTERV } from './main.js';
import {
  isWebSocketPingEvent,
  isWebSocketCloseEvent,
} from '../deps/ws.js';

let pingLoop = async commSock => {
  try {
    await commSock.ping();
  } catch {
    return;
  }
  setTimeout(() => pingLoop(commSock), PING_INTERV);
};

export default (commSock, onCleanup) => {
  let cleanup = () => {
    onCleanup?.();
    commSock.close().catch(err => {
      if (err.message?.trim?.() !== 'Socket has already been closed') {
        console.error(err);
      }
      commSock.closeForce();
    });
  };
  let debouncedCleanup = debounce(() => {
    cleanup();
    console.log('idle commConn dropped');
  }, PING_TIMEOUT);

  let onSockEv = ev => {
    if (isWebSocketPingEvent(ev)) {
      debouncedCleanup();
    }
    if (isWebSocketCloseEvent(ev)) {
      debouncedCleanup.clear();
      cleanup();
      console.log('commSock closed');
    }
  };

  pingLoop(commSock);
  debouncedCleanup();

  return { onSockEv };
};
