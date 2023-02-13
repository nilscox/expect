import { assertion, AssertionFailed } from '../errors/assertion-failed';
import { isArray, isString } from '../errors/guard-error';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface StringAssertions<Actual> {
      toInclude(substring: Actual[number]): void;
    }

    export interface ArrayAssertions<Actual> {
      toInclude(element: Actual[number]): void;
    }
  }
}

expect.addAssertion({
  name: 'toInclude',

  expectedType: 'an array or a string',
  guard(actual): actual is Array<unknown> | string {
    return isArray(actual) || isString(actual);
  },

  prepare(actual, element) {
    return {
      actual,
      meta: {
        element,
        isString: typeof actual === 'string' && typeof element === 'string',
      },
    };
  },

  assert(actual, expected, { element, isString }) {
    if (isString) {
      assertion(actual.includes(element));
      return;
    }

    for (const value of actual) {
      if (this.deepEqual(value, element)) {
        return;
      }
    }

    throw new AssertionFailed();
  },

  getMessage(error) {
    let message = `expected ${this.formatValue(error.actual)}`;

    if (this.not) {
      message += ' not';
    }

    message += ` to include ${this.formatValue(error.meta.element)}`;

    return message;
  },
});
