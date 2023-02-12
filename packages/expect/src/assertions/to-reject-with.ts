import { isPromise } from 'util/types';
import { AssertionFailed } from '../errors/assertion-failed';
import { expect } from '../expect';

declare global {
  namespace Expect {
    interface PromiseAssertions<Actual> {
      toRejectWith<Type>(ExpectedType: { new (...args: any[]): Type }): Promise<Type>;
    }
  }
}

expect.addAssertion({
  name: 'toRejectWith',
  guard: isPromise,
  async assert(promise, ExpectedType) {
    let actual: unknown;

    try {
      actual = await promise;
    } catch (error) {
      if (error == null) {
        throw error;
      }

      if (typeof error === 'object') {
        if (!(error instanceof ExpectedType)) {
          throw new AssertionFailed({ expected: ExpectedType, actual: typeof error, meta: error });
        }
      } else {
        if (error.constructor !== ExpectedType) {
          throw new AssertionFailed({ expected: ExpectedType, actual: typeof error, meta: error });
        }
      }

      return error;
    }

    throw new AssertionFailed({ expected: ExpectedType, meta: actual });
  },
  getMessage(promise, expected) {
    let message = 'expected promise';

    if (this.not) {
      message += ' not';
    }

    message += ' to reject';

    if (expected) {
      message += ` with a ${expected.name}`;
    }

    if (this.not) {
      message += ' but it did';
      return message;
    }

    if (this.error.actual) {
      message += ` but it rejected with ${this.formatValue(this.error.actual)}`;
    } else {
      message += ` but it resolved with ${this.formatValue(this.error.meta)}`;
    }

    return message;
  },
});
