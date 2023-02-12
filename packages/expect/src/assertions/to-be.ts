import { AssertionFailed } from '../errors/assertion-failed';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface GenericAssertions<Actual> {
      toBe(expected: Actual): void;
    }
  }
}

expect.addAssertion({
  name: 'toBe',
  assert(actual, expected) {
    if (!Object.is(actual, expected)) {
      throw new AssertionFailed({ expected });
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
