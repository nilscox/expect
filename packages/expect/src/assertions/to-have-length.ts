import { assertion } from '../errors/assertion-failed';
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

type ObjectWithLength = {
  length: number;
};

expect.addAssertion({
  name: 'toHaveLength',

  expectedType: 'a string, an array or a function',
  guard(subject: unknown): subject is ObjectWithLength {
    if (typeof subject === 'function' || typeof subject === 'string') {
      return true;
    }

    if (typeof subject !== 'object' || subject == null) {
      return false;
    }

    // todo
    // return 'length' in subject && typeof subject.length === 'number';
    return 'length' in subject && typeof (subject as Record<'length', unknown>).length === 'number';
  },

  prepare(actual, length) {
    return {
      actual: actual.length,
      expected: length,
    };
  },

  assert(actual, length) {
    assertion(actual === length);
  },

  getMessage(error) {
    let message = `expected ${this.formatValue(error.subject)}`;

    if (this.not) {
      message += ' not';
    }

    if (typeof error.subject === 'function') {
      message += ` to take ${this.formatValue(error.expected)} argument(s)`;
    } else {
      message += ` to have length ${this.formatValue(error.expected)}`;
    }

    return message;
  },
});
