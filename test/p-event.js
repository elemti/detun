import pEvent from 'https://dev.jspm.io/p-event';
import EE from 'https://deno.land/std/node/events.ts';

let emitter = new EE();

let promise = pEvent(emitter, 'finish');

emitter.emit('finish', 'hey');

console.log(await promise);
