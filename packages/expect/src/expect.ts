import { isPromise } from 'util/types';
import { AssertionError, AssertionFailed } from './errors/assertion-error';
import { GuardError } from './errors/guard-error';
import { any, anything, deepEqual } from './helpers/deep-equal';
import { formatValue } from './helpers/format-value';
import { mapObject } from './helpers/map-object';
import { ValueOf } from './helpers/value-of';

declare global {
  namespace Expect {
    export interface Assertions<Actual = unknown> {}
  }
}

const helpers = (not: boolean) => ({
  not,
  deepEqual,
  formatValue,
});

type Helpers = ReturnType<typeof helpers>;

export interface AssertionDefinition<Name extends AssertionNames, Actual> {
  name: Name;
  expectedType?: string;
  guard?(actual: unknown): actual is Actual;
  assert(
    this: Helpers,
    actual: Actual,
    ...args: Parameters<Expect.Assertions[Name]>
  ): ReturnType<Expect.Assertions[Name]>;
  getMessage(
    this: Helpers & { error?: AssertionFailed },
    actual: Actual,
    ...args: Parameters<Expect.Assertions[Name]>
  ): string;
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

type Not<Actual> = {
  not: Expect.Assertions<Actual>;
};

interface ExpectFunction {
  <Actual>(actual: Actual): Expect.Assertions<Actual> & Not<Actual>;
}

interface ExpectFunction {
  async<Actual>(actual: Promise<Actual>): AsyncAssertions<Actual> & Not<Actual>;
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

const throwAssertionError = (
  assertion: AnyAssertion,
  not: boolean,
  actual: unknown,
  args: AssertionParams,
  error?: AssertionFailed
) => {
  const context = {
    ...helpers(not),
    error,
  };

  const message = assertion.getMessage.call(context, actual, ...args);

  throw new AssertionError(message, assertion.name, actual, args);
};

const createAssertion = (
  not: boolean,
  actual: unknown,
  assertion: AnyAssertion
): ValueOf<Expect.Assertions<unknown>> => {
  return (...args: AssertionParams): AssertionResult => {
    if (isPromise(actual)) {
      throw new Error(
        `expect(actual).${assertion.name}(): actual must not be a promise, use expect.async(actual) instead`
      );
    }

    checkAssertionGuard(actual, assertion);

    try {
      const result = assertion.assert.call(helpers(not), actual, ...args);

      if (not) {
        throwAssertionError(assertion, not, actual, args);
      }

      return result;
    } catch (error) {
      if (error instanceof AssertionFailed) {
        if (not) {
          return;
        }

        throwAssertionError(assertion, not, actual, args, error);
      }

      throw error;
    }
  };
};

const createAsyncAssertion = (
  actual: Promise<unknown>,
  assertion: AnyAssertion
): ValueOf<Expect.Assertions<Promise<unknown>>> => {
  return {} as any;
  // return (...args: AssertionParams): Promise<AssertionResult> => {
  //   checkAssertionGuard(actual, assertion);

  //   return actual
  //     .then(
  //       (resolved) => assertion.assert.call(helpers, resolved, ...args),
  //       (error) => {
  //         if (assertion.name === 'toReject') {
  //           return assertion.assert.call(helpers, Promise.reject(error), ...args);
  //         } else {
  //           // add test case
  //           throw error;
  //         }
  //       }
  //     )
  //     .catch(handleAssertionError);
  // };
};

export const expect: ExpectFunction = (actual: unknown) => {
  const assertions = mapObject<AssertionNames, AnyAssertion, AssertionResult>(
    expect.assertions,
    (assertion) => createAssertion(false, actual, assertion)
  );

  const not = mapObject<AssertionNames, AnyAssertion, AssertionResult>(expect.assertions, (assertion) =>
    createAssertion(true, actual, assertion)
  );

  return {
    ...assertions,
    not,
  };
};

expect.async = (actual: Promise<unknown>) => {
  const assertions = mapObject<AssertionNames, AnyAssertion, AssertionResult>(
    expect.assertions,
    (assertion) => createAsyncAssertion(actual, assertion)
  );

  return {
    ...assertions,
    not: {} as any,
  };
};

expect.assertions = {} as AssertionDefinitions;

expect.addAssertion = <Name extends AssertionNames, Actual>(assertion: AssertionDefinition<Name, Actual>) => {
  expect.assertions[assertion.name] = assertion as AssertionDefinitions[Name];
};

expect.formatValue = formatValue;
expect.anything = anything;
expect.any = any;
