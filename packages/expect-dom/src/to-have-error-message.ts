import expect, { AssertionFailed } from '@nilscox/expect';

declare global {
  namespace Expect {
    export interface HTMLElementAssertions<Actual> {
      toHaveErrorMessage(message?: string): void;
    }
  }
}

export enum ErrorMessageAssertionFailedReason {
  noAriaInvalid = 'noAriaInvalid',
  noErrorMessage = 'noErrorMessage',
  errorMessageNotFound = 'errorMessageNotFound',
  unexpectedMessage = 'unexpectedMessage',
}

type Reason = ErrorMessageAssertionFailedReason;
const Reason = ErrorMessageAssertionFailedReason;

type Meta = {
  element: HTMLElement;
  reason: Reason;
  errorMessageId?: string;
};

expect.addAssertion({
  name: 'toHaveErrorMessage',
  expectedType: 'an instance of HTMLElement',
  guard(actual): actual is HTMLElement {
    return actual instanceof HTMLElement;
  },
  assert(element, expected) {
    const hasExpectedMessage = arguments.length === 2;

    const error = (reason: Reason, errorMessageId?: string, actual?: unknown) => {
      return new AssertionFailed<Meta>({
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
      throw error(Reason.noAriaInvalid);
    }

    const errorMessageId = element.getAttribute('aria-errormessage');

    if (!errorMessageId) {
      throw error(Reason.noErrorMessage);
    }

    const actualMessageElement = document.getElementById(errorMessageId);
    const actualMessage = actualMessageElement?.textContent;

    if (!actualMessageElement) {
      throw error(Reason.errorMessageNotFound, errorMessageId);
    }

    if (hasExpectedMessage && expected !== actualMessage) {
      throw error(Reason.unexpectedMessage, errorMessageId, actualMessage);
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

    const { reason, errorMessageId } = meta as {
      reason: Reason;
      errorMessageId: string;
    };

    if (reason === Reason.noAriaInvalid) {
      message += ' but it does not have attribute aria-invalid=true';
    }

    if (reason === Reason.noErrorMessage) {
      message += ' but it does not have attribute aria-errormessage';
    }

    if (reason === Reason.errorMessageNotFound) {
      message += ` but the error element was not found (id=${this.formatValue(errorMessageId)})`;
    }

    if (reason === Reason.unexpectedMessage) {
      message += ` but it is ${this.formatValue(actual)}`;
    }

    return message;
  },
});
