import { AssertionFailed } from '../errors/assertion-failed';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface Assertions {
      toHaveLength(length: number): void;
    }
  }
}

type ObjectWithLength = { length: number };

expect.addAssertion({
  name: 'toHaveLength',
  expectedType: '{ length: number }',
  guard(actual: unknown): actual is ObjectWithLength {
    if (actual == null) {
      return false;
    }

    if (!Object.getOwnPropertyNames(actual).includes('length')) {
      return false;
    }

    return typeof (actual as Record<string, unknown>)['length'] === 'number';
  },
  assert(actual, length) {
    if (actual.length !== length) {
      throw new AssertionFailed();
    }
  },
  getMessage(actual, length) {
    let message = `expected ${this.formatValue(actual)}`;

    if (this.not) {
      message += ' not';
    }

    if (typeof actual === 'function') {
      message += ` to take ${this.formatValue(length)} argument(s)`;
    } else {
      message += ` to have length ${this.formatValue(length)}`;
    }

    return message;
  },
});
