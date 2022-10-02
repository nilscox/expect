import expect, { AssertionError, ValueFormatter } from '@nilscox/expect';
import sinon from 'sinon';

declare global {
  namespace Expect {
    export interface Assertions {
      toHaveBeenCalled(): void;
    }
  }
}

export class ToHaveBeenCalledAssertionError<T> extends AssertionError<T> {
  constructor(actual: T) {
    super('toHaveBeenCalled', actual);
  }

  format(formatValue: ValueFormatter): string {
    return `expected ${formatValue(this.actual)} to have been called`;
  }
}

expect.addAssertion({
  name: 'toHaveBeenCalled',
  expectedType: 'a sinon.spy()',
  guard(actual): actual is sinon.SinonSpy {
    return actual != null && 'called' in actual;
  },
  assert(actual) {
    if (!actual.called) {
      throw new ToHaveBeenCalledAssertionError(actual);
    }
  },
});
