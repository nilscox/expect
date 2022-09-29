import { AssertionError } from "./errors/assertion-error";
import { formatValue } from "./helpers/format-value";

export interface Assertion<Actual, Args extends unknown[] = []> {
  name: string;
  guard?(actual: Actual): void;
  execute(actual: Actual, ...args: Args): void;
  formatError(this: { formatValue: typeof formatValue }, error: AssertionError<Actual>): string;
}

declare global {
  namespace Expect {
    export type Extended<Actual, T> = GenericAssertions<Actual> & T;

    interface ExpectFunction {
      <Actual extends number>(actual: Actual): Extended<Actual, NumberAssertions>;
      <Actual extends string>(actual: Actual): Extended<Actual, StringAssertions>;
      <Actual extends Function>(actual: Actual): Extended<Actual, FunctionAssertions>;
      <Actual>(actual: Actual): GenericAssertions<Actual>;
    }

    interface ExpectFunction {
      assertions: Record<string, Assertion<any, any[]>>;
      addAssertion<Actual, Args extends unknown[]>(assertion: Assertion<Actual, Args>): void;
      formatValue: typeof formatValue;
    }
  }
}

export const expect: Expect.ExpectFunction = (actual: unknown) => {
  return Object.entries(expect.assertions).reduce(
    (obj, [name, assertion]) => ({
      ...obj,
      [name]: (...args: any[]) => {
        assertion.guard?.(actual);

        try {
          return assertion.execute(actual, ...args);
        } catch (error) {
          if (error instanceof AssertionError) {
            error.message = assertion.formatError.call(expect, error);
          }

          throw error;
        }
      },
    }),
    {} as any
  );
};

expect.assertions = {};

expect.addAssertion = function (assertion) {
  this.assertions[assertion.name] = assertion;
};

expect.formatValue = formatValue;
