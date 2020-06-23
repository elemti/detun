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

let validatePorts = ({ ...ports }) => {
  Object.entries(ports).forEach(([key, val]) => {
    if (isNaN(val)) throw Error(`invalid ${key}: ${val}`);
  });
};

(async () => {
  let { localPort, publicPort, commPort, hostname } = parse(Deno.args);
  validatePorts({ localPort, publicPort });

  await forwardPort({ localPort, publicPort, commPort, hostname });
})();
