import assert from 'assert';
import { AssertionFailed } from '../errors/assertion-failed';
import { ExpectError } from '../errors/expect-error';
import { isMatcher } from '../helpers/create-matcher';

type ErrorAttributes = {
  message: string;
  actual?: unknown;
  expected?: unknown;
  meta?: unknown;
};

export const testError = (callback: () => void, expected?: string | ErrorAttributes) => {
  try {
    callback();
    throw new Error('testError: callback did not throw');
  } catch (error) {
    compareErrors(error, expected);
  }
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
  assert(actual instanceof AssertionFailed, 'actual is not an instance of AssertionFailed');

  if (expected === undefined) {
    return;
  }

  const message = typeof expected === 'string' ? expected : undefined;
  const attributes = typeof expected === 'object' ? expected : undefined;

  if (message) {
    assert.equal(actual.message, message);
  }

  if (attributes) {
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

    for (const key of Object.getOwnPropertyNames(actual)) {
      if (key === 'stack' || key === 'not') {
        continue;
      }

      assertAttribute(key, actual[key as keyof ExpectError], attributes[key as keyof ErrorAttributes]);
    }

    for (const [key, expectedValue] of Object.entries(attributes)) {
      assertAttribute(key, actual[key as keyof ExpectError], expectedValue);
    }
  }
};
