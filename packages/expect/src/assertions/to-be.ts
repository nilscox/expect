import { assertion } from '../errors/assertion-failed';
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

  prepare(actual, expected) {
    return {
      actual,
      expected,
    };
  },

  assert(actual, expected) {
    assertion(Object.is(actual, expected));
  },

  getMessage(error) {
    let message = `expected ${this.formatValue(error.actual)}`;

    if (this.not) {
      message += ' not';
    }

    message += ` to be ${this.formatValue(error.expected)}`;

    return message;
  },
});
