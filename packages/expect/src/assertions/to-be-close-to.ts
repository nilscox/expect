import { AssertionFailed } from '../errors/assertion-failed';
import { isNumber } from '../errors/guard-error';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface Assertions {
      toBeCloseTo(value: number, options?: { threshold?: number; strict?: boolean }): void;
    }
  }
}

expect.addAssertion({
  name: 'toBeCloseTo',
  expectedType: 'number',
  guard: isNumber,
  assert(actual, value, { threshold = 0.001, strict = true } = {}) {
    const delta = Math.abs(actual - value);

    if (delta > threshold || (strict && delta == threshold)) {
      throw new AssertionFailed({ meta: { value, strict, threshold } });
    }
  },
  getMessage(actual, value) {
    let message = `expected ${this.formatValue(actual)}`;

    if (this.not) {
      message += ' not';
    }

    message += ` to be close to ${this.formatValue(value)}`;

    return message;
  },
});
