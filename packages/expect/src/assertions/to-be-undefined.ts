import { AssertionFailed } from '../errors/assertion-error';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface Assertions {
      toBeUndefined(): void;
    }
  }
}

expect.addAssertion({
  name: 'toBeUndefined',
  assert(actual) {
    if (actual !== undefined) {
      throw new AssertionFailed();
    }
  },
  getMessage(actual) {
    let message = `expected ${this.formatValue(actual)}`;

    if (this.not) {
      message += ' not';
    }

    message += ` to be undefined`;

    return message;
  },
});
