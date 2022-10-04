This is a monorepo including some tools to make assertions.

It's purpose was mostly to learn how to implement this kind of library, but also to improve the readability of [another project](https://github.com/nilscox/shakala)'s tests, and most importantly... to have fun!

The library is made of 3 distinct packages, take a look at their respective readme for a complete API documentation.

- [expect](./packages/expect): the main package, implementing the core logic and the main assertions
- [expect-sinon](./packages/expect-sinon): assertions related to [Sinon.JS](https://sinonjs.org/)
- [expect-dom](./packages/expect-dom): assertions related to the DOM

It's inspired by jest's [expect](https://github.com/facebook/jest/tree/main/packages/expect) function, while adding some interesting features. Some of jest's "matchers" are implemented using the same API, allowing a pretty smooth transition:

```ts
import expect from '<this package>';

expect(42).not.toBe(51);
expect({ foo: 'bar' }).toHaveProperty('foo', 'bar');
expect({ foo: 'bar' }).toEqual({ foo: expect.stringMatching(/^b/) });
```

But not all of jest's matchers are implemented, so it's not a drop-in replacement, unlike [vitest](https://vitest.dev/api/#expect) does. There are also some differences that make testing things a bit easier:

```ts
// typescript error because we expected foo to be a string
expect({ foo: 'bar' }).toEqual({ foo: 42 });

// assuming that service.login() returns a promise, we can use expect.async()
await expect.async(service.login('email', 'password')).toEqual(expectedUser);

// we can also retrieve a rejecting promise's error
const error = await expect.rejects(service.login('email', '')).with(ValidationError);
expect(error.fields).toHaveProperty('password', 'required');
```
