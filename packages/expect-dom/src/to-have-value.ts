import expect, { AssertionFailed } from '@nilscox/expect';

declare global {
  namespace Expect {
    export interface Assertions {
      toHaveValue(value: string): void;
    }
  }
}

type InputType = HTMLInputElement | HTMLTextAreaElement;

expect.addAssertion({
  name: 'toHaveValue',
  expectedType: 'an instance of HTMLElement',
  guard(actual): actual is InputType {
    return actual instanceof HTMLInputElement || actual instanceof HTMLTextAreaElement;
  },
  assert(element, expectedValue) {
    const actualValue = element.value;

    if (actualValue === null) {
      if (expectedValue === '') {
        return;
      } else {
        throw new AssertionFailed(actualValue);
      }
    }

    if (!this.deepEqual(actualValue, expectedValue)) {
      throw new AssertionFailed(actualValue);
    }
  },
  getMessage(element, expectedValue) {
    const actualValue = this.error?.meta;
    let message = `expected ${this.formatValue(element)}`;

    if (this.not) {
      message += ' not';
    }

    message += ` to have value`;
    message += ` = ${this.formatValue(expectedValue)}`;

    if (actualValue) {
      message += ` but it is ${this.formatValue(actualValue)}`;
    }

    return message;
  },
});
