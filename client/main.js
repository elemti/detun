import exposePort from './exposePort.js';

(async () => {
  await exposePort(3000, 9000);
})();
