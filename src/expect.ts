import { AssertionError } from './errors/assertion-error';
import { GuardError } from './errors/guard-error';
import { any, anything, deepEqual } from './helpers/deep-equal';
import { formatValue } from './helpers/format-value';
import { mapObject } from './helpers/map-object';
import { ValueOf } from './helpers/value-of';

declare global {
  namespace Expect {
    interface Assertions<Actual = unknown> {}
  }
}

const helpers = {
  deepEqual,
  formatValue,
};

type Helpers = typeof helpers;

export interface AssertionDefinition<Name extends AssertionNames, Actual> {
  name: Name;
  expectedType?: string;
  guard?(actual: unknown): actual is Actual;
  assert(
    this: Helpers,
    actual: Actual,
    ...args: Parameters<Expect.Assertions[Name]>
  ): ReturnType<Expect.Assertions[Name]>;
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
  <Actual>(actual: Actual): Expect.Assertions<Actual>;
}

interface ExpectFunction {
  async<Actual>(actual: Promise<Actual>): AsyncAssertions<Actual>;
}

interface ExpectFunction {
  assertions: AssertionDefinitions;
  addAssertion<Name extends AssertionNames, Actual>(assertion: AssertionDefinition<Name, Actual>): void;
  formatValue: typeof formatValue;
  anything: typeof anything;
  any: typeof any;
}

type AnyAssertion = AssertionDefinition<AssertionNames, unknown>;

type AssertionParams = Parameters<Expect.Assertions<any>[AssertionNames]>;
type AssertionResult = ReturnType<Expect.Assertions<any>[AssertionNames]>;

const checkAssertionGuard = (actual: unknown, assertion: AnyAssertion) => {
  if (assertion.guard && !assertion.guard(actual)) {
    throw new GuardError(assertion.name, actual, assertion.expectedType);
  }
};

const handleAssertionError = (error: unknown) => {
  if (error instanceof AssertionError) {
    error.message = error.format(helpers.formatValue);
  }

  throw error;
};

const createAssertion = (actual: unknown, assertion: AnyAssertion): ValueOf<Expect.Assertions<unknown>> => {
  return (...args: AssertionParams): AssertionResult => {
    checkAssertionGuard(actual, assertion);

    try {
      return assertion.assert.call(helpers, actual, ...args);
    } catch (error) {
      handleAssertionError(error);
    }
  };
};

const createAsyncAssertion = (
  actual: Promise<unknown>,
  assertion: AnyAssertion
): ValueOf<Expect.Assertions<Promise<unknown>>> => {
  return (...args: AssertionParams): Promise<AssertionResult> => {
    checkAssertionGuard(actual, assertion);

    return actual
      .then(
        (resolved) => assertion.assert.call(helpers, resolved, ...args),
        (error) => {
          if (assertion.name === 'toReject') {
            return assertion.assert.call(helpers, Promise.reject(error), ...args);
          } else {
            // add test case
            throw error;
          }
        }
      )
      .catch(handleAssertionError);
  };
};

export const expect: ExpectFunction = (actual: unknown) => {
  return mapObject<AssertionNames, AnyAssertion, AssertionResult>(expect.assertions, (assertion) =>
    createAssertion(actual, assertion)
  );
};

expect.async = (actual: Promise<unknown>) => {
  return mapObject<AssertionNames, AnyAssertion, AssertionResult>(expect.assertions, (assertion) =>
    createAsyncAssertion(actual, assertion)
  );
};

expect.assertions = {} as AssertionDefinitions;

expect.addAssertion = <Name extends AssertionNames, Actual>(assertion: AssertionDefinition<Name, Actual>) => {
  expect.assertions[assertion.name] = assertion as AssertionDefinitions[Name];
};

expect.formatValue = formatValue;
expect.anything = anything;
expect.any = any;
