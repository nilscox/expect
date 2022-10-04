import expect, { AssertionFailed } from '@nilscox/expect';

declare global {
  namespace Expect {
    export interface Assertions {
      toHaveErrorMessage(message?: string): void;
    }
  }
}

enum AssertionFailedReason {
  noAriaInvalid,
  noErrorMessage,
  errorMessageNotFound,
  unexpectedMessage,
}

expect.addAssertion({
  name: 'toHaveErrorMessage',
  expectedType: 'an instance of HTMLElement',
  guard(actual): actual is HTMLElement {
    return actual instanceof HTMLElement;
  },
  assert(element, expectedMessage) {
    const hasExpectedMessage = arguments.length === 2;

    if (!element.getAttribute('aria-invalid')) {
      throw new AssertionFailed({ reason: AssertionFailedReason.noAriaInvalid });
    }

    const errorMessageId = element.getAttribute('aria-errormessage');

    if (!errorMessageId) {
      throw new AssertionFailed({ reason: AssertionFailedReason.noErrorMessage });
    }

    const actualMessageElement = document.getElementById(errorMessageId);
    const actualMessage = actualMessageElement?.textContent;

    if (!actualMessageElement) {
      throw new AssertionFailed({ reason: AssertionFailedReason.errorMessageNotFound, errorMessageId });
    }

    if (hasExpectedMessage && expectedMessage !== actualMessage) {
      throw new AssertionFailed({ reason: AssertionFailedReason.unexpectedMessage, actualMessage });
    }
  },
  getMessage(element, expectedMessage) {
    const hasExpectedMessage = arguments.length === 2;
    const meta = this.error?.meta as any;
    let message = `expected ${this.formatValue(element)}`;

    if (this.not) {
      message += ' not';
    }

    message += ' to have error message';

    if (hasExpectedMessage) {
      message += ` ${this.formatValue(expectedMessage)}`;
    }

    if (!meta) {
      return message;
    }

    if (meta.reason === AssertionFailedReason.noAriaInvalid) {
      message += ' but it does not have attribute aria-invalid=true';
    }

    if (meta.reason === AssertionFailedReason.noErrorMessage) {
      message += ' but it does not have attribute aria-errormessage';
    }

    if (meta.reason === AssertionFailedReason.errorMessageNotFound) {
      message += ` but the error element was not found (id=${this.formatValue(meta.errorMessageId)})`;
    }

    if (meta.reason === AssertionFailedReason.unexpectedMessage) {
      message += ` but it is ${this.formatValue(meta.actualMessage)}`;
    }

    return message;
  },
});
