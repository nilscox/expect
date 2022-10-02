import { AssertionFailed } from '../errors/assertion-error';
import { isFunction } from '../errors/guard-error';
import { expect } from '../expect';
import { deepEqual } from '../helpers/deep-equal';

declare global {
  namespace Expect {
    export interface Assertions<Actual> {
      toThrow(expected?: unknown): Actual | Promise<Actual>;
    }
  }
}

expect.addAssertion({
  name: 'toThrow',
  expectedType: 'a function',
  guard: isFunction,
  assert(func: Function, expected?: unknown) {
    let error: Error | undefined = undefined;
    let actual: unknown;

    try {
      func();
      error = new AssertionFailed(undefined);
    } catch (caught) {
      actual = caught;

      if (expected !== undefined && !deepEqual(expected, caught)) {
        error = new AssertionFailed(caught);
      }
    }

    if (error) {
      throw error;
    }

    return actual;
  },
  getMessage(func, expected) {
    const actual = this.error?.meta;
    let message = `expected ${this.formatValue(func)}`;

    if (this.not) {
      message += ' not';
    }

    if (expected) {
      message += ` to throw ${this.formatValue(expected)}`;
    } else {
      message += ` to throw anything`;
    }

    if (actual === undefined) {
      if (this.not) {
        message += ` but it did`;
      } else {
        message += ` but it did not throw`;
      }
    } else {
      message += ` but it threw ${actual}`;
    }

    return message;
  },
});
