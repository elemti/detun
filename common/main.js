// let arrCast = payload => {
//   if (typeof payload === 'string') {
//     return new TextEncoder().encode(payload);
//   }
//   if (payload?.constructor === Uint8Array) {
//     return payload;
//   }
//   return new Uint8Array();
// };

// export let encode = (payload, { headers = {} } = {}) => {
//   if (headers?.constructor !== Object) throw Error('encode headers must be Object');

//   let bodyArr = arrCast(payload);
//   let headerArr = arrCast(JSON.stringify(headers))
//     .map(it => it === 0 ? 32 : it); // convert null bytes to spaces
//   let fullArr = new Uint8Array([...headerArr, 0, ...bodyArr]);
//   return Object.assign(fullArr, { headers, headerArr, bodyArr, fullArr });
// };

// export let decode = (fullArr = new Uint8Array(), { decodeBody = false } = {}) => {
//   let decoder = new TextDecoder();
//   let nullByteIndex = fullArr.indexOf(0);
//   if (nullByteIndex === -1) {
//     throw Error('extractHeader: header not found!');
//   }
  
//   let headerArr = fullArr.subarray(0, nullByteIndex);
//   let headers = JSON.parse(decoder.decode(headerArr));
//   if (headers?.constructor !== Object) throw Error('decode malformed headers');

//   let bodyArr = fullArr.subarray(nullByteIndex + 1);
//   let bodyText = decodeBody ? decoder.decode(bodyArr) : undefined;
//   return { headers, headerArr, bodyText, bodyArr };
// };

export let localIter = reader => Deno.iter(reader, { bufSize: 32 * 1024 });

export let tcpConnect = (...args) => new Promise((resolve, reject) => {
  let timeoutMs = 3*1000;
  let done = false;
  let callback = (err, conn) => {
    if (done) {
      try { conn && conn.close(); } catch {}
      return;
    }
    done = true;

    if (err) return reject(err);
    else return resolve(conn);
  };

  Deno.connect(...args).then(
    conn => callback(null, conn),
    err => callback(err),
  );

  setTimeout(() => callback(Error('tcpConnect timed out')), timeoutMs);
});

export let skipBadResourceErr = err => {
  if (err?.name?.trim?.() === 'BadResource' && err?.message?.trim?.() === 'Bad resource ID') return;
  throw err;
};

export let PING_INTERV = 5 * 1000;
export let PING_TIMEOUT = 15 * 1000;

export let tryCatch = func => {
  try {
    let res = func();
    if (res instanceof Promise) {
      return res.catch(e => e);
    }
    return res;
  } catch {}
};
