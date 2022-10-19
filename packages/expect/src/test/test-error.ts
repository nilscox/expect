import assert from 'assert';
import { ExpectError } from '../errors/expect-error';

type ErrorAttributes = {
  message: string;
  actual: unknown;
  expected?: unknown;
  meta?: unknown;
};

export const testError = (callback: () => void, param?: string | ErrorAttributes) => {
  try {
    callback();
    throw new Error('testError: callback did not throw');
  } catch (error) {
    if (!(error instanceof ExpectError)) {
      throw error;
    }

    if (param === undefined) {
      return;
    }

    const message = typeof param === 'string' ? param : undefined;
    const attributes = typeof param === 'object' ? param : undefined;

    if (message) {
      if (error instanceof ExpectError) {
        assert.equal(message, error.message);
      } else {
        throw error;
      }
    }

    if (attributes) {
      const assertAttribute = (key: string, actual: unknown, expected: unknown) => {
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

      for (const key of Object.getOwnPropertyNames(error)) {
        if (key === 'stack' || key === 'not') {
          continue;
        }

        assertAttribute(key, error[key as keyof ExpectError], attributes[key as keyof ErrorAttributes]);
      }

      for (const [key, expectedValue] of Object.entries(attributes)) {
        assertAttribute(key, error[key as keyof ExpectError], expectedValue);
      }
    }
  }
};
