import { isPromise } from 'util/types';
import { AssertionFailed } from '../errors/assertion-failed';
import { expect } from '../expect';

declare global {
  namespace Expect {
    interface PromiseAssertions<Actual> {
      toResolve(expected?: Awaited<Actual>): Actual;
    }
  }
}

expect.addAssertion({
  name: 'toResolve',
  guard: isPromise,
  async assert(promise, expected) {
    let actual: unknown;

    try {
      actual = await promise;
    } catch (error) {
      throw new AssertionFailed({ expected, meta: error });
    }

    if (arguments.length === 1) {
      return actual;
    }

    if (!this.deepEqual(actual, expected)) {
      throw new AssertionFailed({ expected, actual });
    }

    return actual;
  },
  getMessage() {
    let message = 'expected promise';

    if (this.not) {
      message += ' not';
    }

    message += ' to resolve';

    if (this.error.expected) {
      message += ` with ${this.formatValue(this.error.expected)}`;
    }

    if (this.error.meta) {
      message += ` but it rejected with ${this.formatValue(this.error.meta)}`;
    } else {
      message += ` but it resolved with ${this.formatValue(this.error.actual)}`;
    }

    return message;
  },
});
