import { AssertionFailed } from '../errors/assertion-failed';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface ArrayAssertions<Actual> {
      toHaveLength(length: number): void;
    }

    export interface StringAssertions<Actual> {
      toHaveLength(length: number): void;
    }

    export interface FunctionAssertions<Actual> {
      toHaveLength(length: number): void;
    }
  }
}

type ObjectWithLength = { length: number };

expect.addAssertion({
  name: 'toHaveLength',
  expectedType: 'a string, an array or a function',
  guard(actual: unknown): actual is ObjectWithLength {
    if (typeof actual === 'function' || typeof actual === 'string') {
      return true;
    }

    if (typeof actual !== 'object' || actual == null) {
      return false;
    }

    return 'length' in actual && typeof actual['length'] === 'number';
  },
  assert(actual, length) {
    if (actual.length !== length) {
      throw new AssertionFailed({ actual: actual.length, expected: length });
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
