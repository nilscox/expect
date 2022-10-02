import { AssertionFailed } from '../errors/assertion-error';
import { isString } from '../errors/guard-error';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface Assertions<Actual> {
      toMatch(expected: RegExp): void;
    }
  }
}

expect.addAssertion({
  name: 'toMatch',
  guard: isString,
  assert(actual, regexp) {
    if (!regexp.exec(actual)) {
      throw new AssertionFailed();
    }
  },
  getMessage(actual, regexp) {
    let message = `expected ${this.formatValue(actual)}`;

    if (this.not) {
      message += ' not';
    }

    message += ` to match ${regexp}`;

    return message;
  },
});
