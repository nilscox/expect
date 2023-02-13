import { isPromise } from 'util/types';
import { assertion, AssertionFailed } from '../errors/assertion-failed';
import { expect } from '../expect';

declare global {
  namespace Expect {
    interface PromiseAssertions<Actual> {
      toResolve(expected?: Awaited<Actual>): Actual;
    }
  }
}

expect.addAssertion({
  name: 'toResolve',

  expectedType: 'a Promise',
  guard: isPromise,

  async prepareAsync(promise, expected) {
    let hasExpected = arguments.length === 2;

    let resolved: unknown;
    let error: unknown;
    let didThrow = false;

    try {
      resolved = await promise;
    } catch (caught) {
      didThrow = true;
      error = caught;
    }

    return {
      actual: resolved,
      expected,
      meta: {
        hasExpected,
        didThrow,
        error,
      },
    };
  },

  assert(actual, expected, { hasExpected, didThrow }) {
    assertion(!didThrow);

    if (hasExpected) {
      assertion(this.deepEqual(actual, expected));
    }

    return actual;
  },

  getMessage(error) {
    let message = 'expected promise';

    if (this.not) {
      message += ' not';
    }

    message += ' to resolve';

    if (error.expected) {
      message += ` with ${this.formatValue(error.expected)}`;
    }

    if (error.meta.error) {
      message += ` but it rejected with ${this.formatValue(error.meta.error)}`;
    } else {
      message += ` but it resolved with ${this.formatValue(error.actual)}`;
    }

    return message;
  },
});
