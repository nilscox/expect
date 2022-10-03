import { isPromise } from 'util/types';
import { AssertionError } from './errors/assertion-error';
import { ExpectedRejection } from './errors/expected-rejection';
import { ExpectedPromise } from './errors/expected-promise';
import { UnexpectedPromise } from './errors/unexpected-promise';
import { AssertionFailed } from './errors/assertion-failed';
import { GuardError } from './errors/guard-error';
import { deepEqual } from './helpers/deep-equal';
import { formatValue } from './helpers/format-value';
import { mapObject } from './helpers/map-object';
import { ValueOf } from './helpers/value-of';
import { any } from './matchers/any';
import { anything } from './matchers/anything';
import { stringMatching } from './matchers/string-matching';
import { objectWith } from './matchers/object-with';

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

type Assertions<Actual> = Expect.Assertions<Actual> & {
  not: Expect.Assertions<Actual>;
};

type AsyncNot<Actual> = {
  not: AsyncAssertions<Actual>;
};

interface ExpectFunction {
  <Actual>(actual: Actual): Expect.Assertions<Actual> & Assertions<Actual>;
}

interface ExpectFunction {
  async<Actual>(promise: Promise<Actual>): AsyncAssertions<Actual> & AsyncNot<Actual>;
  rejects(promise: Promise<unknown>): { with<T>(Type: { new (...args: any[]): T }): Promise<T> };
}

interface ExpectFunction {
  _assertions: AssertionDefinitions;
  addAssertion<Name extends AssertionNames, Actual>(assertion: AssertionDefinition<Name, Actual>): void;
  formatValue: typeof formatValue;
}

interface ExpectFunction {
  anything: typeof anything;
  any: typeof any;
  stringMatching: typeof stringMatching;
  objectWith: typeof objectWith;
}

export type AnyAssertionDefinition = AssertionDefinition<AssertionNames, unknown>;

type AnyAssertion = Expect.Assertions<any>[AssertionNames];
type AnyAssertionParams = Parameters<AnyAssertion>;
type AnyAssertionResult = ReturnType<AnyAssertion>;

const checkAssertionGuard = (actual: unknown, assertion: AnyAssertionDefinition) => {
  if (assertion.guard && !assertion.guard(actual)) {
    throw new GuardError(assertion.name, actual, assertion.expectedType);
  }
};

const throwAssertionError = (
  assertion: AnyAssertionDefinition,
  not: boolean,
  actual: unknown,
  args: AnyAssertionParams,
  error?: AssertionFailed
) => {
  const context = {
    ...helpers(not),
    error,
  };

  const message = assertion.getMessage.call(context, actual, ...args);

  throw new AssertionError(message, assertion.name, actual, args);
};

const createAssertion = (not: boolean, actual: unknown, assertion: AnyAssertionDefinition) => {
  return (...args: AnyAssertionParams): AnyAssertionResult => {
    if (isPromise(actual)) {
      throw new UnexpectedPromise(assertion);
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

const createAssertions = (not: boolean, actual: unknown) => {
  return mapObject<AssertionNames, AnyAssertionDefinition, AnyAssertionResult>(
    expect._assertions,
    (assertion) => createAssertion(not, actual, assertion)
  );
};

export const expect: ExpectFunction = (actual: unknown) => ({
  ...createAssertions(false, actual),
  not: createAssertions(true, actual),
});

const createAsyncAssertion = (
  not: boolean,
  promise: Promise<unknown>,
  assertion: AnyAssertionDefinition
): ValueOf<AsyncAssertions<unknown>> => {
  return async (...args: AnyAssertionParams): Promise<AnyAssertionResult> => {
    if (!isPromise(promise)) {
      throw new ExpectedPromise(assertion);
    }

    return createAssertion(not, await promise, assertion)(...args);
  };
};

const createAsyncAssertions = (not: boolean, actual: Promise<unknown>) => {
  return mapObject<AssertionNames, AnyAssertionDefinition, AnyAssertionResult>(
    expect._assertions,
    (assertion) => createAsyncAssertion(not, actual, assertion)
  );
};

expect.async = (actual: Promise<unknown>) => ({
  ...createAsyncAssertions(false, actual),
  not: createAsyncAssertions(true, actual),
});

expect.rejects = (promise: Promise<unknown>) => ({
  async with(Type) {
    if (!isPromise(promise)) {
      throw new ExpectedPromise();
    }

    try {
      const resolved = await promise;
      throw new ExpectedRejection(expect.formatValue(resolved));
    } catch (caught) {
      if (caught instanceof ExpectedRejection) {
        throw caught;
      }

      if (caught instanceof Type) {
        return caught;
      }

      throw caught;
    }
  },
});

expect._assertions = {} as AssertionDefinitions;

expect.addAssertion = <Name extends AssertionNames, Actual>(assertion: AssertionDefinition<Name, Actual>) => {
  expect._assertions[assertion.name] = assertion as AssertionDefinitions[Name];
};

expect.formatValue = formatValue;

expect.anything = anything;
expect.any = any;
expect.stringMatching = stringMatching;
expect.objectWith = objectWith;
