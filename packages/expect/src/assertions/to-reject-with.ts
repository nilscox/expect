import assert from 'assert';
import { isPromise } from 'util/types';
import { assertion } from '../errors/assertion-failed';
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

  expectedType: 'a Promise',
  guard: isPromise,

  async prepareAsync(promise, ExpectedType) {
    let resolved: unknown;
    let error: unknown;
    let didThrow = false;

    try {
      resolved = await promise;
    } catch (caught) {
      didThrow = true;
      error = caught;
    }

    return {
      actual: error?.constructor,
      expected: ExpectedType,
      meta: {
        didThrow,
        resolved,
        error,
      },
    };
  },

  assert(ActualType, ExpectedType, { didThrow, error }) {
    assertion(didThrow);

    if (error == null) {
      throw error;
    }

    assert(ExpectedType);

    if (typeof error === 'object') {
      assertion(error instanceof ExpectedType);
    } else {
      assertion(ActualType === ExpectedType);
    }

    return error as any;
  },

  getMessage(error) {
    let message = 'expected promise';

    if (this.not) {
      message += ' not';
    }

    message += ' to reject';

    if (error.expected) {
      assert(error.expected instanceof Function);
      message += ` with an instance of ${error.expected.name}`;
    }

    if (this.not) {
      message += ' but it did';
      return message;
    }

    if (error.actual) {
      assert(error.actual instanceof Function);
      message += ` but it rejected with an instance of ${this.formatValue(error.actual.name)}`;
    } else {
      message += ` but it resolved with ${this.formatValue(error.meta.resolved)}`;
    }

    return message;
  },
});
