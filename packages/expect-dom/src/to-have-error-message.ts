import expect, { assertion } from '@nilscox/expect';

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

expect.addAssertion({
  name: 'toHaveErrorMessage',

  expectedType: 'an instance of HTMLElement',
  guard(actual): actual is HTMLElement {
    return actual instanceof HTMLElement;
  },

  prepare(element, expected) {
    const hasExpectedMessage = arguments.length === 2;

    const hasAriaInvalid = element.getAttribute('aria-invalid');
    const errorMessageId = element.getAttribute('aria-errormessage');

    const errorMessageElement = errorMessageId ? document.getElementById(errorMessageId) : undefined;
    const actual = errorMessageElement?.textContent;

    return {
      expected,
      actual,
      meta: {
        hasExpectedMessage,
        hasAriaInvalid,
        errorMessageId,
        errorMessageElement,
        element,
      },
    };
  },

  assert(actual, expected, { hasExpectedMessage, hasAriaInvalid, errorMessageId, errorMessageElement }) {
    assertion(hasAriaInvalid === 'true', Reason.noAriaInvalid);
    assertion(errorMessageId, Reason.noErrorMessage);
    assertion(errorMessageElement, Reason.errorMessageNotFound);

    if (hasExpectedMessage) {
      assertion(this.deepEqual(expected, actual), Reason.unexpectedMessage);
    }
  },

  getMessage(error) {
    let message = `expected ${this.formatValue(error.meta.element)}`;

    if (this.not) {
      message += ' not';
    }

    message += ' to have error message';

    if (error.meta.hasExpectedMessage) {
      message += ` ${this.formatValue(error.expected)}`;
    }

    // if (!error.meta.has) {
    //   return message;
    // }

    const reason = error.hint as Reason;

    if (reason === Reason.noAriaInvalid) {
      message += ' but it does not have attribute aria-invalid=true';
    }

    if (reason === Reason.noErrorMessage) {
      message += ' but it does not have attribute aria-errormessage';
    }

    if (reason === Reason.errorMessageNotFound) {
      message += ` but the error element was not found (id=${this.formatValue(error.meta.errorMessageId)})`;
    }

    if (reason === Reason.unexpectedMessage) {
      message += ` but it is ${this.formatValue(error.actual)}`;
    }

    return message;
  },
});
