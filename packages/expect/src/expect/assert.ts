import { AssertionFailed } from '../errors/assertion-failed';

declare global {
  namespace Expect {
    interface ExpectFunction {
      assert: typeof assert;
    }
  }
}

export function assert(value: unknown, hint?: string): asserts value {
  if (!value) {
    throw new AssertionFailed(hint);
  }
}
