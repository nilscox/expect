import { isPromise } from 'util/types';
import { AssertionError } from '../errors/assertion-error';
import { AssertionFailed } from '../errors/assertion-failed';
import { GuardError } from '../errors/guard-error';
import { UnexpectedPromise } from '../errors/unexpected-promise';
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

const throwAssertionError = (
  assertion: AnyAssertionDefinition,
  not: boolean,
  actual: unknown,
  args: AnyAssertionParams,
  error?: AssertionFailed
) => {
  const context = {
    ...helpers,
    not,
    error,
  };

  const message = assertion.getMessage.call(context, actual, ...args);

  throw new AssertionError(message, assertion.name, actual, args);
};

export const createAssertion = (not: boolean, actual: unknown, assertion: AnyAssertionDefinition) => {
  return (...args: AnyAssertionParams): AnyAssertionResult => {
    if (isPromise(actual)) {
      throw new UnexpectedPromise(assertion);
    }

    checkAssertionGuard(actual, assertion);

    try {
      const result = assertion.assert.call(helpers, actual, ...args);

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
