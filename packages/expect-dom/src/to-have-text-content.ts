import expect, { AssertionFailed } from '@nilscox/expect';

declare global {
  namespace Expect {
    export interface Assertions {
      toHaveTextContent(text: string): void;
    }
  }
}

expect.addAssertion({
  name: 'toHaveTextContent',
  expectedType: 'an instance of HTMLElement',
  guard(actual): actual is HTMLElement {
    return actual instanceof HTMLElement;
  },
  assert(element, text) {
    if (!this.deepEqual(element.textContent, text)) {
      throw new AssertionFailed(element.textContent);
    }
  },
  getMessage(element, expectedValue) {
    const actualText = this.error?.meta;
    let message = `expected ${this.formatValue(element)}`;

    if (this.not) {
      message += ' not';
    }

    message += ' to have text';
    message += ` ${this.formatValue(expectedValue)}`;

    if (actualText) {
      message += ` but it is ${this.formatValue(actualText)}`;
    } else if (this.not) {
      message += ' but it does';
    }

    return message;
  },
});
