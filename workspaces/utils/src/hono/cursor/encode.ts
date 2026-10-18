const encode = <TCursor>(cursor: TCursor) =>
  Buffer.from(JSON.stringify(cursor)).toString("base64url");

export {encode};
