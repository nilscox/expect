import { AssertionFailed } from '../errors/assertion-failed';
import { isArray, isString } from '../errors/guard-error';
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
  guard(actual): actual is Array<unknown> | string {
    return isArray(actual) || isString(actual);
  },
  assert(actual, expectedValue) {
    if (typeof actual === 'string' && typeof expectedValue === 'string') {
      return actual.includes(expectedValue);
    }

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
