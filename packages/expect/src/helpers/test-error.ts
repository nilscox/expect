import assert from 'assert';
import { AssertionFailed } from '../errors/assertion-failed';
import { isMatcher } from './create-matcher';
import { removeStyles } from './styles';

type ErrorAttributes = {
  message: string;
  actual?: unknown;
  expected?: unknown;
  meta?: unknown;
  hint?: unknown;
};

export const testError = (callback: () => void, expected?: string | ErrorAttributes) => {
  let error: unknown;

  try {
    callback();
  } catch (caught) {
    error = caught;
  }

  if (!error) {
    throw new Error('testError: callback did not throw');
  }

  compareErrors(error, expected);
};

export const testErrorAsync = async (promise: Promise<any>, expected?: string | ErrorAttributes) => {
  try {
    await promise;
    throw new Error('testErrorAsync: promise did not reject');
  } catch (error) {
    compareErrors(error, expected);
  }
};

const compareErrors = (actual: unknown, expected?: string | ErrorAttributes) => {
  if (!(actual instanceof AssertionFailed)) {
    throw actual;
  }

  if (expected === undefined) {
    return;
  }

  actual.message = removeStyles(actual.message);

  const message = typeof expected === 'string' ? expected : undefined;
  const attributes = typeof expected === 'object' ? expected : undefined;

  if (message) {
    assert.equal(actual.message, removeStyles(message));
  }

  if (attributes) {
    attributes.message = removeStyles(attributes.message);

    const assertAttribute = (key: string, actual: unknown, expected: unknown) => {
      if (isMatcher(expected)) {
        assert.equal(String(actual), String(expected));
        return;
      }

      assert.deepStrictEqual(
        actual,
        expected,
        [
          `invalid error attribute for key "${key}"`,
          `error["${key}"] = ${actual}`,
          `expected["${key}"] = ${expected}`,
        ].join('\n')
      );
    };

    for (const key of ['message', 'expected', 'actual'] as const) {
      assertAttribute(key, actual[key], attributes[key as keyof ErrorAttributes]);
    }

    for (const [key, expectedValue] of Object.entries(attributes)) {
      if (key === 'meta') {
        continue;
      }

      assertAttribute(key, actual[key as keyof AssertionFailed], expectedValue);
    }

    for (const [key, expectedValue] of Object.entries(attributes['meta'] ?? {})) {
      assertAttribute(key, actual['meta'][key], expectedValue);
    }
  }
};
