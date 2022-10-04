import expect, { AssertionFailed } from '@nilscox/expect';

declare global {
  namespace Expect {
    export interface Assertions {
      toBeDisabled(): void;
    }
  }
}

expect.addAssertion({
  name: 'toBeDisabled',
  expectedType: 'an instance of HTMLButtonElement',
  guard(actual): actual is HTMLButtonElement {
    return actual instanceof HTMLButtonElement;
  },
  assert(element) {
    if (!element.disabled) {
      throw new AssertionFailed();
    }
  },
  getMessage(element) {
    let message = `expected ${this.formatValue(element)}`;

    if (this.not) {
      message += ' not';
    }

    message += ' to be disabled';

    return message;
  },
});
