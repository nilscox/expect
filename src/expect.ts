import { isPromise } from "util/types";
import { AssertionError } from "./errors/assertion-error";
import { GuardError } from "./errors/guard-error";
import { formatValue } from "./helpers/format-value";
import { mapObject } from "./helpers/map-object";

declare global {
  namespace Expect {
    interface Assertions<Actual = unknown> {}
  }
}

export interface AssertionDefinition<Name extends AssertionNames, Actual> {
  name: Name;
  expectedType?: string;
  guard?(actual: unknown): actual is Actual;
  assert(actual: Actual, ...args: Parameters<Expect.Assertions[Name]>): ReturnType<Expect.Assertions[Name]>;
  formatError(this: { formatValue: typeof formatValue }, error: AssertionError<Actual>): string;
}

type AssertionNames = keyof Expect.Assertions;
type AssertionDefinitions = {
  [Name in AssertionNames]: AssertionDefinition<Name, unknown>;
};

type AsyncAssertions<Actual> = {
  [Name in AssertionNames]: (
    ...args: Parameters<Expect.Assertions<Actual>[Name]>
  ) => Promise<ReturnType<Expect.Assertions<Actual>[Name]>>;
};

interface ExpectFunction {
  <Actual>(actual: Promise<Actual>): AsyncAssertions<Actual>;
  <Actual>(actual: Actual): Expect.Assertions<Actual>;
}

interface ExpectFunction {
  assertions: AssertionDefinitions;
  addAssertion<Name extends AssertionNames, Actual>(assertion: AssertionDefinition<Name, Actual>): void;
  formatValue: typeof formatValue;
}

const createAssertion = <Name extends AssertionNames, Actual>(
  actual: Actual,
  assertion: AssertionDefinitions[Name]
): Expect.Assertions<Actual>[Name] => {
  return (...a: any[]): any => {
    const args = a as Parameters<Expect.Assertions<Actual>[Name]>;

    if (assertion.guard && !assertion.guard(actual)) {
      throw new GuardError(assertion.name, actual, assertion.expectedType);
    }

    const handleError = (error: unknown) => {
      if (error instanceof AssertionError) {
        error.message = assertion.formatError.call(expect, error);
      }

      throw error;
    };

    if (isPromise(actual)) {
      return actual
        .then(
          (resolved) => assertion.assert(resolved, ...args),
          (error) => {
            if (assertion.name === "toReject") {
              return assertion.assert(Promise.reject(error), ...args);
            } else {
              // add test case
              throw error;
            }
          }
        )
        .catch(handleError);
    }

    try {
      return assertion.assert(actual, ...args);
    } catch (error) {
      handleError(error);
    }
  };
};

export const expect: ExpectFunction = (actual: unknown) => {
  return mapObject(expect.assertions, ([, assertion]) => createAssertion(actual, assertion) as any);
};

expect.assertions = {} as AssertionDefinitions;

expect.addAssertion = <Name extends AssertionNames, Actual>(assertion: AssertionDefinition<Name, Actual>) => {
  expect.assertions[assertion.name] = assertion as AssertionDefinitions[Name];
};

expect.formatValue = formatValue;
