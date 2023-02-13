import { isPromise } from 'util/types';
import { AssertionFailed } from '../errors/assertion-failed';
import { GuardError } from '../errors/guard-error';
import { deepEqual } from '../helpers/deep-equal';
import { formatValue } from '../helpers/format-value';
import { AnyAssertionDefinition, AnyAssertionParams, AnyAssertionResult, Helpers } from './expect-types';

export const helpers: Helpers = {
  deepEqual,
  formatValue,
};

const checkAssertionGuard = (actual: unknown, assertion: AnyAssertionDefinition) => {
  if (assertion.guard && !assertion.guard(actual)) {
    throw new GuardError(assertion.name, actual, assertion.expectedType);
  }
};

export const createAssertion = (not: boolean, actual: unknown, assertion: AnyAssertionDefinition) => {
  return (...args: AnyAssertionParams): AnyAssertionResult => {
    checkAssertionGuard(actual, assertion);

    if (isPromise(actual)) {
      return handleAsyncAssertion(not, actual, assertion, ...args);
    }

    let result: unknown;
    let error: AssertionFailed | undefined = undefined;

    try {
      result = assertion.assert.call(helpers, actual, ...args);

      if (not) {
        error = new AssertionFailed();
      }
    } catch (err) {
      if (!(err instanceof AssertionFailed)) {
        throw error;
      }

      if (not) {
        return;
      }

      error = err;
    }

    if (error) {
      const context = {
        ...helpers,
        not,
        error,
      };

      error.message = assertion.getMessage.call(context, actual, ...args);
      error.not = not;

      throw error;
    }

    return result;
  };
};

const handleAsyncAssertion = async (
  not: boolean,
  promise: Promise<unknown>,
  assertion: AnyAssertionDefinition,
  ...args: AnyAssertionParams
) => {
  let actual: unknown;
  let result: unknown;
  let error: AssertionFailed | undefined = undefined;

  try {
    result = await assertion.assert.call(helpers, promise, ...args);

    if (not) {
      error = new AssertionFailed();
    }
  } catch (err) {
    if (!(err instanceof AssertionFailed)) {
      throw error;
    }

    if (not) {
      return;
    }

    error = err;
  }

  if (error) {
    const context = {
      ...helpers,
      not,
      error,
    };

    error.message = assertion.getMessage.call(context, actual, ...args);
    error.not = not;

    throw error;
  }

  return result;
};
