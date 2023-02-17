import { assertion } from '../errors/assertion-failed';
import { expect } from '../expect';
import { isNumber } from '../utils/guards';

declare global {
  namespace Expect {
    export interface NumberAssertions<Actual> {
      toBeMoreThan(value: number, options?: { strict?: boolean }): void;
    }
  }
}

expect.addAssertion({
  name: 'toBeMoreThan',

  expectedType: 'number',
  guard: isNumber,

  prepare(actual, expected, { strict = true } = {}) {
    return {
      actual,
      expected,
      meta: { strict },
    };
  },

  assert(actual: number, expected, { strict }) {
    assertion(actual >= expected);

    if (strict) {
      assertion(actual !== expected);
    }
  },

  getMessage(error) {
    return this.formatter
      .expected(error.actual)
      .not.append('to be more')
      .if(error.meta.strict, {
        then: 'than',
        else: 'or equal to',
      })
      .value(error.expected)
      .result();
  },
});
