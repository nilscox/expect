import { AssertionFailed } from '../errors/assertion-failed';
import { expect } from '../expect';
import { deepEqual } from '../helpers/deep-equal';

declare global {
  namespace Expect {
    export interface Assertions<Actual> {
      toEqual(expected: Actual): void;
    }
  }
}

expect.addAssertion({
  name: 'toEqual',
  assert(actual, expected) {
    if (!deepEqual(actual, expected)) {
      throw new AssertionFailed();
    }
  },
  getMessage(actual, expected) {
    let message = `expected ${this.formatValue(actual)}`;

    if (this.not) {
      message += ' not';
    }

    message += ` to equal ${this.formatValue(expected)}`;

    return message;
  },
});
