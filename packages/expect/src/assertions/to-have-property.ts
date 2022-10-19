import { AssertionFailed } from '../errors/assertion-failed';
import { expect } from '../expect';

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
    const hasExpectedValue = arguments.length === 3;

    const path = property.split('.');
    const [lastProperty] = path.slice(-1);

    let parent: any = actual;

    for (const property of path.slice(0, -1)) {
      parent = parent[property];

      if (!parent) {
        throw new AssertionFailed();
      }
    }

    if (!(lastProperty in parent)) {
      throw new AssertionFailed();
    }

    const actualValue = parent[lastProperty];

    if (hasExpectedValue && !this.deepEqual(actualValue, expectedValue)) {
      throw new AssertionFailed({ actual: actualValue, expected: expectedValue });
    }
  },
  getMessage(actual, property, expectedValue) {
    const hasExpectedValue = arguments.length === 3;
    let message = `expected ${this.formatValue(actual)}`;

    if (this.not) {
      message += ' not';
    }

    message += ` to have property ${this.formatValue(property)}`;

    if (hasExpectedValue) {
      message += ` = ${this.formatValue(expectedValue)}`;
    }

    return message;
  },
});
