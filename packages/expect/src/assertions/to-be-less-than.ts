import { assertion } from '../errors/assertion-failed';
import { isNumber } from '../errors/guard-error';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface NumberAssertions<Actual> {
      toBeLessThan(value: number, options?: { strict?: boolean }): void;
    }
  }
}

expect.addAssertion({
  name: 'toBeLessThan',

  expectedType: 'number',
  guard: isNumber,

  prepare(actual, value, { strict = true } = {}) {
    return {
      actual,
      expected: value,
      meta: { strict },
    };
  },

  assert(actual, expected, { strict }) {
    assertion(actual <= expected);

    if (strict) {
      assertion(actual !== expected);
    }
  },

  getMessage(error) {
    let message = `expected ${this.formatValue(error.actual)}`;

    if (this.not) {
      message += ' not';
    }

    message += ' to be less';

    if (error.meta.strict) {
      message += ' than';
    } else {
      message += ' or equal to';
    }

    message += ` ${this.formatValue(error.expected)}`;

    return message;
  },
});
