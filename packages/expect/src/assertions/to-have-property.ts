import { AssertionFailed } from '../errors/assertion-failed';
import { expect } from '../expect';
import { deepEqual } from '../helpers/deep-equal';
import { get } from '../helpers/get';

declare global {
  namespace Expect {
    export interface Assertions<Actual> {
      toHaveProperty(property: string, value?: unknown): void;
    }
  }
}

type NonNullObject = {};

expect.addAssertion({
  name: 'toHaveProperty',
  expectedType: 'non-null object',
  guard(actual): actual is NonNullObject {
    return actual !== null && actual !== undefined;
  },
  assert(actual: Record<PropertyKey, unknown>, property: string, expectedValue?: unknown) {
    const value = get(actual, property);

    if (value === undefined) {
      throw new AssertionFailed();
    }

    if (expectedValue !== undefined && !deepEqual(value, expectedValue)) {
      throw new AssertionFailed();
    }
  },
  getMessage(actual, property, expectedValue) {
    let message = `expected ${this.formatValue(actual)}`;

    if (this.not) {
      message += ' not';
    }

    message += ` to have property ${this.formatValue(property)}`;

    if (expectedValue !== undefined) {
      message += ` = ${this.formatValue(expectedValue)}`;
    }

    return message;
  },
});
