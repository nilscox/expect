import { assertion } from '../errors/assertion-failed';
import { expect } from '../expect';
import { isNumber } from '../utils/guards';

declare global {
  namespace Expect {
    export interface NumberAssertions<Actual> {
      toBeCloseTo(value: number, options?: { threshold?: number; strict?: boolean }): void;
    }
  }
}

expect.addAssertion({
  name: 'toBeCloseTo',

  expectedType: 'number',
  guard: isNumber,

  prepare(actual, value, { threshold = 0.001, strict = true } = {}) {
    return {
      actual,
      expected: value,
      meta: { threshold, strict },
    };
  },

  assert(actual, expected, { threshold, strict }) {
    const delta = Math.abs(actual - expected);

    assertion(delta <= threshold);

    if (strict) {
      assertion(delta !== threshold);
    }
  },

  getMessage(error) {
    return this.formatter
      .append('expected')
      .value(error.actual)
      .not.append('to be close to')
      .value(error.expected)
      .append(`(± ${error.meta.threshold})`)
      .result();
  },
});
