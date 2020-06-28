import forwardPort from './forwardPort.js';
import cliArgs from '../common/cli-args.js';

let { publicPort, commPort, hostname, _: [localPort] } = cliArgs;

let retryLoop = async func => {
  let retryInterv = 3 * 1000;
  while (true) {
    try {
      await func();
    } catch (err) {
      console.error(err);
    } finally {
      console.log();
      console.log(`waiting ${retryInterv}ms to retry...`);
      console.log();
      await new Promise(res => setTimeout(res, retryInterv));
    }
  }
};

let validatePorts = ({ ...ports }) => {
  Object.entries(ports).forEach(([key, val]) => {
    if (isNaN(val)) throw Error(`invalid ${key}: ${val}`);
  });
};

(async () => {
  validatePorts({ localPort });

  await retryLoop(async () => {
    await forwardPort({ localPort, publicPort, commPort, hostname });
  });
})();
