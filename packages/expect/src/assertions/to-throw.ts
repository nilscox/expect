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
    const formatter = this.formatter.expected(error.subject).not.if(error.meta.hasExpected, {
      then: `to throw ${this.formatValue(error.expected)}`,
      else: 'to throw anything',
    });

    if (!error.meta.didThrow) {
      return formatter.append('but it did not throw').result();
    }

    return formatter
      .if(this.not, {
        then: 'but it did',
        else: `but it threw ${this.formatValue(error.actual)}`,
      })
      .result();
  },
});
