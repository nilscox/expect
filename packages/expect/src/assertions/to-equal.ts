import { assertion } from '../errors/assertion-failed';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface GenericAssertions<Actual> {
      toEqual(expected: Actual): void;
    }
  }
}

expect.addAssertion({
  name: 'toEqual',

  prepare(actual, expected) {
    return { actual, expected };
  },

  assert(actual, expected) {
    assertion(this.deepEqual(actual, expected));
  },

  getMessage(error) {
    let message = `expected ${this.formatValue(error.actual)}`;

    if (this.not) {
      message += ' not';
    }

    message += ` to equal ${this.formatValue(error.expected)}`;

    return message;
  },
});
