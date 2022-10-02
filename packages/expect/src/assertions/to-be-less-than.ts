import { AssertionFailed } from '../errors/assertion-failed';
import { isNumber } from '../errors/guard-error';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface Assertions<Actual> {
      toBeLessThan(value: number, options?: { strict?: boolean }): void;
    }
  }
}

expect.addAssertion({
  name: 'toBeLessThan',
  expectedType: 'number',
  guard: isNumber,
  assert(actual: number, value: number, { strict = true } = {}) {
    if (actual > value || (strict && actual == value)) {
      throw new AssertionFailed();
    }
  },
  getMessage(actual, value, { strict = true } = {}) {
    let message = `expected ${this.formatValue(actual)}`;

    if (this.not) {
      message += ` not`;
    }

    message += ` to be less`;

    if (strict) {
      message += ` than`;
    } else {
      message += ` or equal to`;
    }

    message += ` ${this.formatValue(value)}`;

    return message;
  },
});
