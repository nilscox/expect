import expect, { AssertionFailed } from '@nilscox/expect';

declare global {
  namespace Expect {
    export interface Assertions {
      toHaveErrorMessage(message?: string): void;
    }
  }
}

enum AssertionFailedReason {
  noAriaInvalid = 'noAriaInvalid',
  noErrorMessage = 'noErrorMessage',
  errorMessageNotFound = 'errorMessageNotFound',
  unexpectedMessage = 'unexpectedMessage',
}

expect.addAssertion({
  name: 'toHaveErrorMessage',
  expectedType: 'an instance of HTMLElement',
  guard(actual): actual is HTMLElement {
    return actual instanceof HTMLElement;
  },
  assert(element, expected) {
    const hasExpectedMessage = arguments.length === 2;

    const error = (reason: AssertionFailedReason, errorMessageId?: string, actual?: unknown) => {
      return new AssertionFailed({
        expected,
        actual,
        meta: {
          element,
          reason,
          errorMessageId,
        },
      });
    };

    if (!element.getAttribute('aria-invalid')) {
      throw error(AssertionFailedReason.noAriaInvalid);
    }

    const errorMessageId = element.getAttribute('aria-errormessage');

    if (!errorMessageId) {
      throw error(AssertionFailedReason.noErrorMessage);
    }

    const actualMessageElement = document.getElementById(errorMessageId);
    const actualMessage = actualMessageElement?.textContent;

    if (!actualMessageElement) {
      throw error(AssertionFailedReason.errorMessageNotFound, errorMessageId);
    }

    if (hasExpectedMessage && expected !== actualMessage) {
      throw error(AssertionFailedReason.unexpectedMessage, errorMessageId, actualMessage);
    }
  },
  getMessage(element, expectedMessage) {
    const hasExpectedMessage = arguments.length === 2;
    const { actual, meta } = this.error;
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

    const { reason, errorMessageId } = meta as { reason: AssertionFailedReason; errorMessageId: string };

    if (reason === AssertionFailedReason.noAriaInvalid) {
      message += ' but it does not have attribute aria-invalid=true';
    }

    if (reason === AssertionFailedReason.noErrorMessage) {
      message += ' but it does not have attribute aria-errormessage';
    }

    if (reason === AssertionFailedReason.errorMessageNotFound) {
      message += ` but the error element was not found (id=${this.formatValue(errorMessageId)})`;
    }

    if (reason === AssertionFailedReason.unexpectedMessage) {
      message += ` but it is ${this.formatValue(actual)}`;
    }

    return message;
  },
});
