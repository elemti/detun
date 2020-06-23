import { isFreePort } from '../deps/free_port.js';

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

export { isFreePort };

export default async (range = [49152, 65535]) => {
  let [min, max] = range;
  let uncheckedPorts = Array(max + 1 - min).fill().map((x, i) => min + i);
  while (uncheckedPorts.length > 0) {
    let [port] = uncheckedPorts.splice(
      getRandomIntInclusive(0, uncheckedPorts.length - 1),
      1,
    );
    if (await isFreePort(port)) return port;
  }
  throw Error('CANT_FIND_FREE_PORT');
};
