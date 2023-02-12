import { isPromise } from 'util/types';
import { AssertionFailed } from '../errors/assertion-failed';
import { expect } from '../expect';

declare global {
  namespace Expect {
    interface PromiseAssertions<Actual> {
      toReject<Type>(expected?: Type): Promise<Type>;
    }
  }
}

expect.addAssertion({
  name: 'toReject',
  guard: isPromise,
  async assert(promise, expected) {
    let actual: unknown;

    try {
      actual = await promise;
    } catch (error) {
      if (arguments.length === 1) {
        return error;
      }

      if (!this.deepEqual(error, expected)) {
        throw new AssertionFailed({ expected, actual: error });
      }

      return error;
    }

    throw new AssertionFailed({ expected, meta: actual });
  },
  getMessage(promise, expected) {
    let message = 'expected promise';

    if (this.not) {
      message += ' not';
    }

    message += ' to reject';

    if (expected) {
      message += ` with ${this.formatValue(expected)}`;
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
