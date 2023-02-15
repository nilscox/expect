import assert from 'assert';
import { isPromise } from 'util/types';
import { assertion } from '../errors/assertion-failed';
import { isFunction } from '../errors/guard-error';
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
    const formatter = this.formatter
      .append('expected promise')
      .not.append('to reject')
      .if(isFunction, error.expected, {
        then: (expected) => `with an instance of ${expected.name}`,
      });

    if (this.not) {
      return formatter.append('but it did').result();
    }

    return formatter
      .if(isFunction, error.actual, {
        then: (actual) => `but it rejected with an instance of ${actual.name}`,
        else: `but it resolved with ${this.formatValue(error.meta.resolved)}`,
      })
      .result();
  },
});
