This is the documentation for an assertion library's core logic. The full library is divided into three packages, take a look at [the main readme](../../../../) for more information.

This documentation covers:

- [Basics](#basics)
  - [The expect function](#the-expect-function)
  - [Inverting assertions](#inverting-assertions)
  - [Async / Promise handling](#async--promise-handling)
- [Extensions](#extensions)
  - [Custom assertions](#custom-assertions)
  - [Custom matchers](#custom-matchers)
  - [Custom formatters](#custom-formatters)
- [API documentation](#custom-matchers)
  - [Assertions](#assertions)
  - [Matchers](#matchers)

## Basics

### The expect function

The library's default export is a function that must be called with only one argument: the value under test (i.e. the value on which we will execute an assertion). This function returns an object containing all assertions from the core package, along with the ones registered through plugins and your own.

```ts
import expect from '<this package>';

function add(left: number, right: number) {
  return left + right;
}

expect(add(1, 2)).toEqual(3);
expect(add(0.1, 0.2)).toBeCloseTo(0.3);

// this will throw an error: "expected 6 to equal 42"
expect(add(4, 2)).toEqual(42);
```

When an assertion fails, it throws an instance of node's [AssertionError](https://nodejs.org/api/assert.html#class-assertassertionerror) containing two properties named "expected" and "actual" (when they make sense). These are conventionally used by test runners to print a diff between the two values.

Check out the [API documentation](#api-documentation) section for more information about the assertions available in the core package.

> Note that in this library, an "assertion" represents the fact to check that a requirement is met, like `expect(value).toEqual()` (this is what jest calls a "matcher"). And a "matcher" in this library is a way to extend the comparaison function, like `expect.stringMatching()` (I don't know how jest calls this).

### Inverting assertions

Assertions can be inverted using the `.not` operator right after the call to `expect()`. In this case, an assertion that was not passing becomes passing and vice versa. The error message will be correctly formatted according to wether the condition was inverted or not.

```ts
expect(42).not.toEqual(51); // pass
expect(() => {}).not.toThrow(); // pass
expect({ foo: 'bar' }).not.toHaveProperty('foo'); // expected { foo: 'bar' } not to have property "foo"
```

## Extensions

This library was designed with extensibility in mind, so it's super easy to add your own logic to it. Creating new assertions and matchers associated to **your domain** will make your tests **more meaningful**. For example, you can replace `expect(user).toHaveProperty('role', 'admin')` with `expect(user).toBeAdmin()`.

> Any fool can write code that a computer can understand. Good programmers write code that humans can understand.
>
> <em>Martin Fowler</em>

### Custom assertions

Let's say you work on a backend application, and often need to assert some response's status codes. You can create a custom assertion for that!

First, we use [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) so typescript will known that the `expect` function can handle our new assertion.

```ts
declare global {
  namespace Expect {
    export interface Assertions {
      toHaveStatus(expected: number): void;
    }
  }
}
```

Now we implement our assertion's logic using `expect.addAssertion()`. We'll need to provide the assertion name (the method name declared previously), a type guard, the actual assertion logic and an error message formatter.

```ts
import expect, { AssertionFailed } from '<this package>';

expect.addAssertion({
  name: 'toHaveStatus',

  expectedType: 'a Response',
  guard(actual): actual is Response {
    return actual instanceof Response;
  },

  // the first parameter is typed according to our type guard, and the others or
  // typed from the assertion's definition
  assert(response, expected) {
    if (response.status !== expected) {
      throw new AssertionFailed({ actual, expected });
    }
  },

  getMessage(response, expected) {
    let message = 'expected response';

    if (this.not) {
      message += ' not';
    }

    message += ` to have status ${this.formatValue(expected)}`;

    if (this.not) {
      message += ' but does';
    } else {
      message += ` but it is ${this.formatValue(response.status)}`;
    }

    return message;
  },
});
```

This needs to be done before calling `expect(...).toHaveStatus()`, most likely in some setup file like in mocha's [root hooks](https://mochajs.org/#root-hook-plugins).

As you can see, we use `this.not` and `this.formatValue()` in the `getMessage` function. These are automatically provided by the library, `not` being `true` when the assertion was inverted, and `formatValue` being a helper that prints its parameter in the most understandable way.

We can now use this assertion in our tests to easily check some response's status code! The `.toHaveHeader()` method does not exist in the core library, you'll have to implement it yourself :)

```ts
const response = await request('/some/resource');

expect(response).toHaveStatus(301);
expect(response).toHaveHeader('location', '/login');
```

When the assertion throws, it will have a message formatted using the `getMessage` function. It will be something like `expected response to have status 301 but it is 500`. And if the assertion was inverted, it would be `expected response not to have status 301 but it does`.

### Custom matchers

It's also easy to add custom matchers, allowing to extend the way objects are compared within the library. In this example, we'll create a `arrayIncluding` matcher, that will check that an array contains a given value.

Like for the custom assertion, we need to let typescript know about our custom matcher.

```ts
declare global {
  namespace Expect {
    export interface Matchers {
      arrayIncluding: typeof arrayIncluding;
    }
  }
}
```

We use `typeof arrayIncluding` here to leverage our matcher's inferred type instead of repeating it. But if your curious, this type will be `(value: string) => string[]`.

All custom matchers need to be created using the `createMatcher` function.

We give it a function as parameter that will receive the value we're checking, and as many more parameters that will come from the invocation of the matcher itself.

I know this sentence can be a little confusing, so this should help understand.

```ts
const check = (value, ...args) => {
  // use value and args to return a boolean
};

const myMatcher = createMatcher(check);

// check will be called with ('foo', 1, 2, 3)
expect('foo').toEqual(myMatcher(1, 2, 3));
```

For a matcher to be considered "matching", it should either return `true` or nothing (`undefined`). Otherwise if it returns `false` or if it throws an `AssertionFailed` error, the value will be considered "not matching". Here is how we can implement `arrayIncluding`.

```ts
import { createMatcher } from '<this package>';

const arrayIncluding = createMatcher((array: string[], value: string) => {
  expect(array).toInclude(value);
});

expect.addMatcher('arrayIncluding', arrayIncluding);
```

As with custom assertions, this needs to be done before it is used, like in a setup file loaded by the test runner. Once this is done, we can use the custom matcher in our tests!

```ts
const user = {
  name: 'Averell',
  friends: ['Joe', 'Jack', 'William'],
};

expect(user).toEqual({
  name: 'Averell',
  friends: expect.arrayIncluding('Joe'),
});

// we can also combine matchers
expect(user).toHaveProperty('friends', expect.arrayIncluding(expect.stringMatching(/^Will/)));
```

## Custom formatter

### Formatting

Formatting values correctly is crucial to be able to debug assertions easily. The way values are displayed in error messages can be customized using custom formatters.

```ts
class User {
  constructor(public name: string) {}
}

const isUser = (value: unknown): value is User => {
  return value instanceof User;
};

addFormatter(isUser, (user) => `User (name: ${user.name})`);
```

When an instance of the `User` class needs to be included in an error message, the custom formatter will be used to serialize it into a string.

```ts
expect(new User('Roger')).toHaveProperty('name', 'Gaston');
// expected User (name: Roger) to have property "name" = "Gaston"
```

## API documentation

### Assertions

Assertions are functions returned from a call to `expect(...)`, and used to perform assertion logic on the value passed to `expect`.

You can easily [add new assertions](#custom-assertions) to extend the library's abilities, which can be very useful to check stuff that are meaningful in your domain.

Here are the core assertions that are built into the library.

- [toBeDefined](#tobedefined)
- [toBe](#tobe)
- [toEqual](#toequal)
- [toBeLessThan and toBeMoreThan](#tobelessthan-and-tobemorethan)
- [toBeCloseTo](#tobecloseto)
- [toMatch](#tomatch)
- [toHaveLength](#tohavelength)
- [toInclude](#toinclude)
- [toHaveProperty](#tohaveproperty)
- [toResolve](#toresolve)
- [toReject](#toreject)
- [toRejectWith](#torejectwith)

#### toBeDefined

Assert that a value is not [`undefined`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined).

```ts
expect(1).toBeDefined(); // pass
expect(undefined).toBeDefined(); // fails
```

#### toBe

Assert that a value are referentially equal. This assertion internally uses [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) to determine whether the two values are the same.

```ts
expect(1).toBe(1); // pass
expect({}).toBe({}); // fails

const obj = {};
expect(obj).toBe(obj); // pass
```

#### toEqual

Assert that two values are equal, using a deep equality check. The way these values are compared can be customized using the built-in [matchers](#matchers) and your [custom matchers](#custom-matchers).

Also, the value given to `.toEqual()` is expected to have the same type as the one given to `expect()`. This enables a better typescript integration, by autocompleting the expected value.

```ts
expect(1).toEqual(1); // pass
expect({ foo: 'bar' }).toEqual({ foo: 'bar' }); // pass
expect({ foo: 'bar' }).toEqual({ foo: expect.stringMatching(/^b/) }); // pass
expect({ foo: 'bar' }).toEqual({ foo: 'not bar' }); // fail
```

#### toBeLessThan and toBeMoreThan

Assert that a number is (strictly) below or above another number. If `strict` is false, the assertion won't fail when the values are equal.

```ts
expect(1).toBeLessThan(2); // pass
expect(2).toBeLessThan(1); // fail
expect(1).toBeMoreThan(1); // fail
expect(1).toBeMoreThan(1, { strict: false }); // pass
```

#### toBeCloseTo

Assert that a number is close to another. This can be useful when we run into [floating-point arithmetic](https://floating-point-gui.de/) problems. The default threshold is `0.001`, but you can customize it. If `strict` is false, the assertion won't fail if the values differ by the threshold value exactly (defaults to true).

```ts
expect(1).toBeCloseTo(1.0001); // pass
expect(0.1 + 0.2).toBeCloseTo(0.3); // pass
expect(2).toBeCloseTo(3); // fail
expect(2, { threshold: 1 }).toBeCloseTo(3); // fail
expect(2, { threshold: 1, strict: false }).toBeCloseTo(3); // pass
```

#### toMatch

Assert that a string matches a [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).

```ts
expect('foo').toMatch(/^f/); // pass
expect('bar').toMatch(/^f/); // fail
```

#### toHaveLength

Assert that an array or a string have a given length. This assertion also works on a function to assert on its number of parameters.

```ts
expect([1, 2, 3]).toHaveLength(3); // pass
expect('hello').toHaveLength(5); // pass
expect([]).toHaveLength(2); // fail
```

#### toInclude

Assert that an array includes a given element or that a string includes a substring.

```ts
expect([1, 2]).toInclude(2); // pass
expect([1, 2]).toInclude(3); // fail
expect('hello').toInclude('llo'); // pass
```

#### toHaveProperty

Assert that an object has a property, optionally checking its specific value. Use dot notation to check an object's deeply nested property, and [matchers](#matchers) to customize the way the object's property value is checked.

```ts
expect({ foo: 'bar' }).toHaveProperty('foo'); // pass
expect({}).toHaveProperty('foo'); // fail
expect({ foo: 'not bar' }).toHaveProperty('foo', 'bar'); // fail
expect({ some: { nested: [{ value: 1 }, { value: 42 }] } }).toHaveProperty('some.nested.1.value', 42); // pass
expect({ foo: 'bar' }).toHaveProperty('foo', expect.stringMatching(/^b/)); // pass
```

#### toThrow

Assert that a function throws, and optionally check the value that was thrown. The assertion will fail if the function does _not_ throw.

```ts
const throwError = () => {
  throw new Error('oops');
};

const doNothing = () => {};

expect(throwError).toThrow(); // pass
expect(doNothing).toThrow(); // fails
expect(throwError).toThrow(new Error('oops')); // pass
expect(throwError).toThrow(new Error('argh')); // fail
expect(throwError).toThrow(expect.objectWith({ message: expect.stringMatching(/oo/) })); // pass
```

#### toResolve

Assert that a promise resolves, optionally checking the resolved value. The assertion will fail if the promise rejects. The call to `expect` will forward the resolved value.

```ts
expect(Promise.resolve(42)).toResolve(42); // pass
expect(Promise.reject(new Error('oops'))).toResolve(); // fail
expect(Promise.resolve('foo')).toResolve(expect.stringMatching(/oo/)); // pass
```

#### toReject

Assert that a promise rejects, optionally checking the rejected value. The assertion will fail if the promise resolve. The call to `expect` will resolve the rejected value.

```ts
expect(Promise.reject(new Error('oops'))).toReject(); // pass
expect(Promise.reject(new Error('argh'))).toReject(new Error('argh')); // pass
expect(Promise.resolve(42)).toReject(); // fail
```

#### toRejectWith

Assert that a promise rejects with an error of a given type. The call to `expect` will resolve the rejected value.

```ts
expect(Promise.reject(new Error('oops'))).toRejectWith(Error); // pass
expect(Promise.reject(42)).toRejectWith(Error); // fail
```

### Matchers

Matchers are a way to customize the way values are deeply (recursively) compared within the library. They are used in numerous places, like in `.toEqual()`, `.toHaveProperty()`, [expect-sinon](../expect-sinon)'s `.toHaveBeenCalledWith()`, etc.

Like with assertions, you can easily [add new matchers](#custom-matchers) to extend the library's ability, which can be very useful to match a value in a way that is meaningful in your domain.

Here are the core matchers that are built into the library.

- [anything](#anything)
- [any](#any)
- [stringMatching](#stringMatching)
- [objectWith](#objectWith)

#### anything

The `expect.anything()` matcher allows any value, it never fails. This is useful when an object's property is not the one you are asserting on.

```ts
expect({ foo: 'bar', value: 42 }).toEqual({ foo: expect.anything(), value: 42 }); // pass
```

#### any

The `expect.any(Constructor)` matcher allows any value having a given type. It can be a primitive type using the primitive's constructor (like `String` or `Boolean`), or a class type.

```ts
expect<number>(42).toEqual(expect.any(Number)); // pass
expect<any>({ foo: 'bar' }).toEqual({ foo: expect.any(Boolean) }); // fail

class Toto {}
expect({ foo: new Toto() }).toEqual({ foo: expect.any(Toto) }); // pass
```

#### stringMatching

The `expect.stringMatching()` matcher allows any string matching a given [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).

```ts
expect({ foo: 'bar' }).toEqual({ foo: expect.stringMatching(/^b/) }); // pass
expect({ foo: 'bar' }).toEqual({ foo: expect.stringMatching(/foo/) }); // fail
expect({ foo: 'bar' }).toEqual(expect.stringMatching(/^b/)); // fail
```

#### objectWith

The `expect.objectWith()` matcher allows any object containing a subset of the given properties.

```ts
expect({ foo: 'bar', baz: 'qux' }).toEqual(expect.objectWith({ foo: 'bar' })); // pass
expect({ foo: 'bar' }).toEqual(expect.objectWith({ foo: 'bar', baz: 'qux' })); // fail
```
