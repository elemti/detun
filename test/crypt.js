import { timelyEncrypt, timelyDecrypt } from '../common/crypt.js';

let encrypted = timelyEncrypt('test string');
console.log(encrypted);

await new Promise(res => setTimeout(res, 2000));

console.log(timelyDecrypt(encrypted));
