import { isPromise } from 'util/types';
import { AssertionFailed } from '../errors/assertion-failed';
import { GuardError } from '../errors/guard-error';
import { deepEqual } from '../helpers/deep-equal';
import { messageFormatter } from '../helpers/message-formatter';
import { expect } from './expect';
import { AnyAssertionDefinition, AnyAssertionParams, AnyAssertionResult, Helpers } from './expect-types';

export const helpers: Helpers = {
  deepEqual,
  formatValue: () => '',
};

const checkAssertionGuard = (assertion: AnyAssertionDefinition, actual: unknown) => {
  if (assertion.guard && !assertion.guard(actual)) {
    throw new GuardError(assertion.name, actual, assertion.expectedType);
  }
};

export const createAssertion = (assertion: AnyAssertionDefinition, not: boolean, subject: unknown) => {
  return (...args: AnyAssertionParams): AnyAssertionResult => {
    checkAssertionGuard(assertion, subject);

    if (isPromise(subject)) {
      return handleAsyncAssertion(assertion, not, subject, ...args);
    }

    const { actual, expected, meta } = {
      actual: subject,
      ...assertion.prepare?.(subject, ...args),
    };

    return handleAssertion(assertion, not, subject, actual, expected, meta);
  };
};

const handleAsyncAssertion = async (
  assertion: AnyAssertionDefinition,
  not: boolean,
  promise: Promise<unknown>,
  ...args: AnyAssertionParams
) => {
  const prepareResult = await assertion.prepareAsync?.(promise, ...args);
  const { actual, expected, meta } = prepareResult ?? {};

  return handleAssertion(assertion, not, promise, actual, expected, meta);
};

const handleAssertion = (
  assertion: AnyAssertionDefinition,
  not: boolean,
  subject: unknown,
  actual: unknown,
  expected: unknown,
  meta: unknown
) => {
  let result: unknown;
  let error: AssertionFailed | undefined = undefined;

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

  const formatter = messageFormatter({
    formatValue: expect.format,
    not,
    maxInlineLength: 60,
  });

  const context: ThisParameterType<AnyAssertionDefinition['getMessage']> = {
    ...helpers,
    not,
    formatter,
    formatValue: formatter.formatValue.bind(formatter),
  };

  error.operator = assertion.name;
  error.subject = subject;
  error.expected = expected;
  error.actual = actual;
  error.meta = meta;

  error.message = assertion.getMessage.call(context, error);

  throw error;
};
