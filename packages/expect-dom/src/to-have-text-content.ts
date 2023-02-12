import expect, { AssertionFailed } from '@nilscox/expect';

declare global {
  namespace Expect {
    export interface HTMLElementAssertions<Actual> {
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
  assert(element, expected) {
    const actual = element.textContent;

    if (!this.deepEqual(actual, expected)) {
      throw new AssertionFailed({ actual, expected, meta: { element } });
    }
  },
  getMessage(element, expectedValue) {
    const { actual } = this.error;
    let message = `expected ${this.formatValue(element)}`;

    if (this.not) {
      message += ' not';
    }

    message += ' to have text';
    message += ` ${this.formatValue(expectedValue)}`;

    if (actual) {
      message += ` but it is ${this.formatValue(actual)}`;
    } else if (this.not) {
      message += ' but it does';
    }

    return message;
  },
});
