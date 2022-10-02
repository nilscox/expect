import { AssertionFailed } from '../errors/assertion-error';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface Assertions<Actual> {
      toBe(expected: Actual): void;
    }
  }
}

expect.addAssertion({
  name: 'toBe',
  assert(actual, expected) {
    if (!Object.is(actual, expected)) {
      throw new AssertionFailed();
    }
  },
  getMessage(actual, expected) {
    let message = `expected ${this.formatValue(actual)}`;

    if (this.not) {
      message += ' not';
    }

    message += ` to be ${this.formatValue(expected)}`;

    return message;
  },
});
