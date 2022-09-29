import { AssertionError } from "../errors/assertion-error";
import { expect } from "../expect";
import { GuardError } from "../errors/guard-error";

declare global {
  namespace Expect {
    interface GenericAssertions {
      toHaveProperty(property: string, value?: unknown): void;
    }
  }
}

export class ToHavePropertyAssertionError<T> extends AssertionError<T> {
  constructor(actual: T, public readonly property: string, public readonly value: unknown | undefined) {
    super("toHaveProperty", actual);
  }
}

expect.addAssertion({
  name: "toHaveProperty",
  guard(actual) {
    if (actual === undefined || actual === null) {
      throw new GuardError(this.name, "non-null object", typeof actual, actual);
    }
  },
  execute(actual: Record<PropertyKey, unknown>, property: string, value?: unknown) {
    if (!actual.hasOwnProperty(property)) {
      throw new ToHavePropertyAssertionError(actual, property, value);
    }

    if (value !== undefined && actual[property] !== value) {
      throw new ToHavePropertyAssertionError(actual, property, value);
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
