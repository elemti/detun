import forwardPort from './forwardPort.js';
import cliArgs from '../common/cli-args.js';

let { publicPort, commPort, hostname, _: [localPort] } = cliArgs;

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
  validatePorts({ localPort });

  await forwardPort({ localPort, publicPort, commPort, hostname });
})();
