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
  assert(element, expected) {
    const actual = element.value;

    if (actual === null) {
      if (expected === '') {
        return;
      } else {
        throw new AssertionFailed({ actual, expected, meta: { element } });
      }
    }

    if (!this.deepEqual(actual, expected)) {
      throw new AssertionFailed({ actual, expected, meta: { element } });
    }
  },
  getMessage(element, expected) {
    const { actual } = this.error;
    let message = `expected ${this.formatValue(element)}`;

    if (this.not) {
      message += ' not';
    }

    message += ` to have value`;
    message += ` = ${this.formatValue(expected)}`;

    if (actual) {
      message += ` but it is ${this.formatValue(actual)}`;
    }

    return message;
  },
});
