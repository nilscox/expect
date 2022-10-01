import { AssertionError } from "../errors/assertion-error";
import { expect } from "../expect";
import { deepEqual } from "../helpers/deep-equal";
import { get } from "../helpers/get";

declare global {
  namespace Expect {
    interface Assertions<Actual> {
      toHaveProperty(property: string, value?: unknown): void;
    }
  }
}

type NonNullObject = {};

export class ToHavePropertyAssertionError<T> extends AssertionError<T> {
  constructor(actual: T, public readonly property: string, public readonly value: unknown | undefined) {
    super("toHaveProperty", actual);
  }
}

expect.addAssertion({
  name: "toHaveProperty",
  expectedType: "non-null object",
  guard(actual): actual is NonNullObject {
    return actual !== null && actual !== undefined;
  },
  assert(actual: Record<PropertyKey, unknown>, property: string, expectedValue?: unknown) {
    const value = get(actual, property);

    if (value === undefined) {
      throw new ToHavePropertyAssertionError(actual, property, expectedValue);
    }

    if (expectedValue !== undefined && !deepEqual(value, expectedValue)) {
      throw new ToHavePropertyAssertionError(actual, property, expectedValue);
    }
  },
  formatError(error: ToHavePropertyAssertionError<unknown>) {
    let message = `expected ${this.formatValue(error.actual)}`;

    message += ` to have property ${this.formatValue(error.property)}`;

    if (error.value !== undefined) {
      message += ` = ${this.formatValue(error.value)}`;
    }

    return message;
  },
});
