import { assertion } from '../errors/assertion-failed';
import { isFunction } from '../errors/guard-error';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface FunctionAssertions<Actual> {
      toThrow(expected?: unknown): Actual;
    }
  }
}

expect.addAssertion({
  name: 'toThrow',

  expectedType: 'a function',
  guard: isFunction,

  prepare(func, expected) {
    const hasExpected = arguments.length === 2;

    let didThrow = false;
    let actual: unknown;

    try {
      func();
    } catch (caught) {
      didThrow = true;
      actual = caught;
    }

    return {
      actual,
      expected,
      meta: {
        hasExpected,
        didThrow,
      },
    };
  },

  assert(actual, expected, { hasExpected, didThrow }) {
    assertion(didThrow);

    if (hasExpected) {
      assertion(this.deepEqual(actual, expected));
    }

    return actual;
  },

  getMessage(error) {
    let message = `expected ${this.formatValue(error.subject)}`;

    if (this.not) {
      message += ' not';
    }

    if (error.meta.hasExpected) {
      message += ` to throw ${this.formatValue(error.expected)}`;
    } else {
      message += ` to throw anything`;
    }

    if (!error.meta.didThrow) {
      message += ` but it did not throw`;
      return message;
    }

    if (this.not) {
      message += ` but it did`;
    } else {
      message += ` but it threw ${this.formatValue(error.actual)}`;
    }

    return message;
  },
});
