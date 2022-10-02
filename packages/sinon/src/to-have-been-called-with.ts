import expect, { AssertionError, ValueFormatter } from '@nilscox/expect';
import sinon from 'sinon';

declare global {
  namespace Expect {
    interface Assertions {
      toHaveBeenCalledWith(...args: any[]): void;
    }
  }
}

export class ToHaveBeenCalledWithAssertionError<T> extends AssertionError<T> {
  constructor(actual: T, public readonly args: any[]) {
    super('toHaveBeenCalledWith', actual);
  }

  format(formatValue: ValueFormatter): string {
    return `expected ${formatValue(this.actual)} to have been called with ${formatValue(this.args)}`;
  }
}

expect.addAssertion({
  name: 'toHaveBeenCalledWith',
  expectedType: 'a sinon.spy()',
  guard(actual): actual is sinon.SinonSpy {
    return actual != null && 'called' in actual;
  },
  assert(actual, ...args) {
    if (!actual.calledWith(...args)) {
      throw new ToHaveBeenCalledWithAssertionError(actual, args);
    }
  },
});
