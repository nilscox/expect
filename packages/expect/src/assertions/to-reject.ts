import { isPromise } from 'util/types';
import { AssertionFailed } from '../errors/assertion-error';
import { expect } from '../expect';

declare global {
  namespace Expect {
    export interface Assertions<Actual> {
      toReject(expectedInstance?: any): any;
    }
  }
}

expect.addAssertion({
  name: 'toReject',
  guard: isPromise,
  async assert(promise, expectedInstance) {
    let error: AssertionFailed | undefined = undefined;
    let resolved: unknown;

    try {
      resolved = await promise;
      error = new AssertionFailed({ resolved });
    } catch (caught) {
      if (expectedInstance !== undefined && !(caught instanceof expectedInstance)) {
        error = new AssertionFailed({ resolved, caught });
      } else {
        return caught;
      }
    }

    if (error) {
      throw error;
    }
  },
  getMessage(_promise, expectedInstance) {
    let { resolved, caught } = this.error?.meta as Record<'resolved' | 'caught', unknown>;
    let message = `expected promise to reject`;

    if (expectedInstance) {
      message += ` with an instance of ${expectedInstance.name}`;
    }

    if (caught === undefined) {
      message += ` but it resolved with ${this.formatValue(resolved)}`;
    } else {
      message += ` but it rejected with ${this.formatValue(caught)}`;
    }

    return message;
  },
});
