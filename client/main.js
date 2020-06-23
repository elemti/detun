import forwardPort from './forwardPort.js';
import { parse } from '../deps/flags.js';

// let forwardRetryLoop = async (...args) => {
//   let retryInterv = 3 * 1000;
//   try {
//     await forwardPort(...args);
//   } catch (err) {
//     console.dir(err);
//     console.log(`waiting ${retryInterv}ms to retry...`);
//     setTimeout(() => forwardRetryLoop(...args), retryInterv);
//   }
// };

(async () => {
  console.dir(parse(Deno.args));
  // forwardRetryLoop(3000, 9000);
  await forwardPort(3000, 9000);
})();
