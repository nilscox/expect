import { AssertionFailed } from '../errors/assertion-failed';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface GenericAssertions<Actual> {
      toBeDefined(): void;
    }
  }
}

expect.addAssertion({
  name: 'toBeDefined',
  assert(actual) {
    if (actual === undefined) {
      throw new AssertionFailed({ actual });
    }
  },
  getMessage(actual) {
    let message = `expected ${this.formatValue(actual)}`;

    if (this.not) {
      message += ' not';
    }

    message += ` to be defined`;

    return message;
  },
});
