import sjcl from 'https://dev.jspm.io/sjcl';

let SECRET = 'aPkbYv9n6HyJfd6Rjngv7y337Etc4dXQtqbRMwZK9yhdpkZPCDRG3EPETaeGGNbvzBkRA5YHeSkhtJxZDPbNJSURFsf2AsCNGQj';

export let encrypt = jsonType => sjcl.encrypt(SECRET, JSON.stringify(jsonType)); // can be string, number, object, array, null
export let decrypt = encrypted => JSON.parse(sjcl.decrypt(SECRET, encrypted));

// use these to prevent replay attacks
export let timelyEncrypt = (payload, ttl = 3) => encrypt({ exp: Date.now() + ttl * 1000, payload });
export let timelyDecrypt = encrypted => {
  let { exp, payload } = decrypt(encrypted);
  if (exp && Date.now() < exp) return payload;
  throw Error('PAYLOAD_EXPIRED');
};

export let encode123 = pl => {
  if (pl?.constructor !== Object) throw Error('encode payload must be Object');
  let payload = { ...pl };
  let specialKeys = {};
  let obj = { payload, specialKeys };
  
  Object.entries(payload).forEach(([key, value]) => {
    if (value instanceof Uint8Array) {
      payload[key] = Array.from(value);
      specialKeys[key] = 'Uint8Array';
    }
  });

  return new TextEncoder().encode(encrypt(obj));
};

export let decode123 = buffer => {
  let { payload, specialKeys } = decrypt(
    new TextDecoder().decode(buffer)
  );
  Object.entries(specialKeys).forEach(([key, keyType]) => {
    if (keyType === 'Uint8Array') {
      payload[key] = new Uint8Array(payload[key]);
    }
  });
  return payload;
};
