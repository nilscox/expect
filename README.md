This is a monorepo providing some tools to make assertions.

The library is made of 3 distinct packages, take a look at their respective readme for a complete API documentation.

- [expect](./packages/expect): the main package, implementing the core logic and the main assertions
- [expect-sinon](./packages/expect-sinon): assertions related to [Sinon.JS](https://sinonjs.org/)
- [expect-dom](./packages/expect-dom): assertions related to the DOM

It's inspired by jest's [expect](https://github.com/facebook/jest/tree/main/packages/expect) function, but with some interesting additions. Some of jest's "matchers" are implemented with the same API, allowing a pretty smooth transition.

```ts
import expect from '<this package>';

expect(42).not.toBe(51);
expect({ foo: 'bar' }).toHaveProperty('foo', 'bar');
expect({ foo: 'bar' }).toEqual({ foo: expect.stringMatching(/^b/) });
```

But not all of jest's matchers are implemented, so it's not a drop-in replacement, unlike [vitest](https://vitest.dev/api/#expect). The differences with jest's assertion library aim to make testing a bit easier, by implementing new features, improving TypeScript integration, and allowing extensibility at different levels.

```ts
// typescript error because we expected foo to be a string
expect({ foo: 'bar' }).toEqual({ foo: 42 });

// assuming that service.login() returns a promise
await expect(service.login('email', 'password')).toResolve(expectedUser);

// we can also retrieve a rejecting promise's error
const error = await expect(service.login('email', '')).toRejectWith(ValidationError);
expect(error.fields).toHaveProperty('password', 'required');
```
