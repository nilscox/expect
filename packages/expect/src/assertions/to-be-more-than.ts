import { AssertionFailed } from '../errors/assertion-failed';
import { isNumber } from '../errors/guard-error';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface Assertions {
      toBeMoreThan(value: number, options?: { strict?: boolean }): void;
    }
  }
}

expect.addAssertion({
  name: 'toBeMoreThan',
  expectedType: 'number',
  guard: isNumber,
  assert(actual: number, value, { strict = true } = {}) {
    if (actual < value || (strict && actual == value)) {
      throw new AssertionFailed({ meta: { value, strict } });
    }
  },
  getMessage(actual, value, { strict = true } = {}) {
    let message = `expected ${this.formatValue(actual)}`;

    if (this.not) {
      message += ` not`;
    }

    message += ` to be more`;

    if (strict) {
      message += ` than`;
    } else {
      message += ` or equal to`;
    }

    message += ` ${this.formatValue(value)}`;

    return message;
  },
});
