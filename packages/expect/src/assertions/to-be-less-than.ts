import { assertion } from '../errors/assertion-failed';
import { expect } from '../expect';
import { isNumber } from '../utils/guards';

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
    return this.formatter
      .expected(error.actual)
      .not.append('to be less')
      .if(error.meta.strict, {
        then: 'than',
        else: 'or equal to',
      })
      .value(error.expected)
      .result();
  },
});
