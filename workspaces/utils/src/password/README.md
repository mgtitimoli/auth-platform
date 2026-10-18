# password

Password hashing with [scrypt](https://nodejs.org/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback)
(Node.js only). Each hash stores its salt and scrypt parameters, so the
parameters can change without invalidating existing hashes.

## Functions

### getHash

#### Description

Function that returns a hash of the given password, using a random salt and
the scrypt parameters recommended by OWASP (N=2^17, r=8, p=1).

#### Example

```ts
import {getHash} from "@mgtitimoli/utils/password";

const passwordHash = await getHash("correct horse");
// scrypt$131072$8$1$<salt>$<key>
```

### isMatchingHash

#### Description

Function that returns a boolean indicating if the given password matches the
given hash (compared in constant time). A malformed hash never matches.

#### Example

```ts
import {isMatchingHash} from "@mgtitimoli/utils/password";

await isMatchingHash("correct horse", passwordHash); // true
await isMatchingHash("battery staple", passwordHash); // false
```

## Modules

- [password-hash](./password-hash.ts)
