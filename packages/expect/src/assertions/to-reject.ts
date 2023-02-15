import { isPromise } from 'util/types';
import { assertion } from '../errors/assertion-failed';
import { expect } from '../expect';

declare global {
  namespace Expect {
    interface PromiseAssertions<Actual> {
      toReject<Type>(expected?: Type): Promise<Type>;
    }
  }
}

expect.addAssertion({
  name: 'toReject',

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
      actual: error,
      expected,
      meta: {
        hasExpected,
        didThrow,
        resolved,
      },
    };
  },

  assert(actual, expected, { hasExpected, didThrow }) {
    assertion(didThrow);

    if (hasExpected) {
      assertion(this.deepEqual(actual, expected));
    }

    return actual as any;
  },

  getMessage(error) {
    const formatter = this.formatter
      .append('expected promise')
      .not.append('to reject')
      .if(error.meta.hasExpected, { then: `with ${this.formatValue(error.expected)}` });

    if (this.not) {
      return formatter.append('but it did').result();
    }

    return formatter
      .if(Boolean(error.actual), {
        then: `but it rejected with ${this.formatValue(error.actual)}`,
        else: `but it resolved with ${this.formatValue(error.meta.resolved)}`,
      })
      .result();
  },
});
