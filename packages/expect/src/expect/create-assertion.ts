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

export const createAssertion = (not: boolean, subject: unknown, assertion: AnyAssertionDefinition) => {
  return (...args: AnyAssertionParams): AnyAssertionResult => {
    checkAssertionGuard(subject, assertion);

    if (isPromise(subject)) {
      return handleAsyncAssertion(not, subject, assertion, ...args);
    }

    let result: unknown;
    let error: AssertionFailed | undefined = undefined;

    const { actual, expected, meta } = {
      actual: subject,
      ...assertion.prepare?.(subject, ...args),
    };

    try {
      result = assertion.assert.call(helpers, actual, expected, meta);

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

    if (!error) {
      return result;
    }

    const context = {
      ...helpers,
      not,
      error,
    };

    error.operator = assertion.name;
    error.subject = subject;
    error.expected = expected;
    error.actual = actual;
    error.meta = meta;

    error.message = assertion.getMessage.call(context, error);

    throw error;
  };
};

const handleAsyncAssertion = async (
  not: boolean,
  promise: Promise<unknown>,
  assertion: AnyAssertionDefinition,
  ...args: AnyAssertionParams
) => {
  let result: unknown;
  let error: AssertionFailed | undefined = undefined;

  const { actual, expected, meta } = (await assertion.prepareAsync?.(promise, ...args)) ?? {};

  try {
    result = assertion.assert.call(helpers, actual, expected, meta);

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

  if (!error) {
    return result;
  }

  const context = {
    ...helpers,
    not,
    error,
  };

  error.operator = assertion.name;
  error.expected = expected;
  error.actual = actual;
  error.meta = meta;

  error.message = assertion.getMessage.call(context, error);

  throw error;
};
