import { AssertionFailed } from '../errors/assertion-failed';
import { isString } from '../errors/guard-error';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface StringAssertions<Actual> {
      toMatch(expected: RegExp): void;
    }
  }
}

type Meta = {
  regexp: RegExp;
};

expect.addAssertion({
  name: 'toMatch',
  guard: isString,
  assert(actual, regexp) {
    if (!regexp.exec(actual)) {
      throw new AssertionFailed<Meta>({ actual, meta: { regexp } });
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
