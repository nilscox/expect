import { AssertionFailed } from '../errors/assertion-failed';
import { isArray } from '../errors/guard-error';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface Assertions {
      toInclude(value: unknown): void;
    }
  }
}

expect.addAssertion({
  name: 'toInclude',
  guard: isArray,
  assert(actual, expectedValue) {
    for (const value of actual) {
      if (this.deepEqual(value, expectedValue)) {
        return;
      }
    }

    throw new AssertionFailed();
  },
  getMessage(actual, regexp) {
    let message = `expected ${this.formatValue(actual)}`;

    if (this.not) {
      message += ' not';
    }

    message += ` to include ${regexp}`;

    return message;
  },
});
