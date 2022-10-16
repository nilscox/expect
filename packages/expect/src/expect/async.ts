import { isPromise } from 'util/types';
import { ExpectedPromise } from '../errors/expected-promise';
import { ExpectedRejection } from '../errors/expected-rejection';
import { isMatcher } from '../helpers/create-matcher';
import { mapObject } from '../helpers/map-object';
import { ValueOf } from '../helpers/value-of';
import { createAssertion } from './create-assertion';
import {
  AnyAssertionDefinition,
  AnyAssertionParams,
  AnyAssertionResult,
  AssertionNames,
} from './expect-types';

type AsyncAssertions<Actual> = {
  [Name in AssertionNames]: (
    ...args: Parameters<Expect.Assertions<Actual>[Name]>
  ) => Promise<ReturnType<Expect.Assertions<Actual>[Name]>>;
};

type AsyncNot<Actual> = {
  not: AsyncAssertions<Actual>;
};

declare global {
  namespace Expect {
    interface ExpectFunction {
      async<Actual>(promise: Promise<Actual>): AsyncAssertions<Actual> & AsyncNot<Actual>;
      rejects(promise: Promise<unknown>): { with<T>(Type: T | { new (...args: any[]): T }): Promise<T> };
    }
  }
}

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

const createAsyncAssertions = (expect: Expect.ExpectFunction, not: boolean, actual: Promise<unknown>) => {
  return mapObject<AssertionNames, AnyAssertionDefinition, AnyAssertionResult>(
    expect._assertions,
    (assertion) => createAsyncAssertion(not, actual, assertion)
  );
};

export const async: Expect.ExpectFunction['async'] = function (
  this: Expect.ExpectFunction,
  actual: Promise<unknown>
) {
  return {
    ...createAsyncAssertions(this, false, actual),
    not: createAsyncAssertions(this, true, actual),
  };
};

export const rejects: Expect.ExpectFunction['rejects'] = function (
  this: Expect.ExpectFunction,
  promise: Promise<unknown>
) {
  return {
    with: with_(this, promise),
  };
};

type With = ReturnType<Expect.ExpectFunction['rejects']>['with'];

const with_ = (expect: Expect.ExpectFunction, promise: Promise<unknown>): With => {
  return async (instanceOrClass) => {
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

      // use expect.any(instanceOrClass)?
      if (typeof instanceOrClass === 'function' && !isMatcher(instanceOrClass)) {
        if (caught instanceof instanceOrClass) {
          return caught;
        } else {
          throw caught;
        }
      }

      expect(caught).toEqual(instanceOrClass);

      return caught as any;
    }
  };
};
