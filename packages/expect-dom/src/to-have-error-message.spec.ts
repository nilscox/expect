import expect from '@nilscox/expect';
import { testError } from '@nilscox/expect/helpers/test-error';

describe('toHaveErrorMessage', () => {
  const createInput = ({
    invalid,
    errorMessageId,
    message,
  }: Partial<{ invalid: boolean; errorMessageId: string; message: string }>) => {
    const container = document.createElement('div');
    const error = document.createElement('div');
    const input = document.createElement('input');

    document.body.appendChild(container);
    container.appendChild(input);

    if (invalid) {
      input.setAttribute('aria-invalid', 'true');
    }

    if (errorMessageId) {
      error.setAttribute('id', errorMessageId);
      input.setAttribute('aria-errormessage', errorMessageId);
    }

    if (message) {
      container.appendChild(error);
      error.innerHTML = message;
    }

    return input;
  };

  it('invalid input', () => {
    const input = createInput({
      invalid: true,
      errorMessageId: 'id',
      message: 'error',
    });

    expect(input).toHaveErrorMessage();
  });

  it('invalid input with error message', () => {
    const input = createInput({
      invalid: true,
      errorMessageId: 'id',
      message: 'error',
    });

    expect(input).toHaveErrorMessage('error');
  });

  it('not invalid input', () => {
    const input = createInput({});

    testError(() => expect(input).toHaveErrorMessage('error'), {
      message:
        'expected HTMLInputElement {} to have error message "error" but it does not have attribute aria-invalid=true',
      expected: 'error',
      hint: 'noAriaInvalid',
      meta: {
        element: input,
        errorMessageId: null,
      },
    });

    input.setAttribute('aria-invalid', 'false');

    testError(
      () => expect(input).toHaveErrorMessage('error'),
      'expected HTMLInputElement {} to have error message "error" but it does not have attribute aria-invalid=true'
    );
  });

  it('invalid input without error message', () => {
    testError(
      () => expect(createInput({ invalid: true })).toHaveErrorMessage('error'),
      'expected HTMLInputElement {} to have error message "error" but it does not have attribute aria-errormessage'
    );
  });

  it('invalid input with error message but without error element', () => {
    testError(
      () => expect(createInput({ invalid: true, errorMessageId: 'messageId' })).toHaveErrorMessage('error'),
      'expected HTMLInputElement {} to have error message "error" but the error element was not found (id="messageId")'
    );
  });

  it('invalid input with unexpected error message', () => {
    const input = createInput({ invalid: true, errorMessageId: 'id', message: 'err' });

    testError(() => expect(input).toHaveErrorMessage('error'), {
      message: 'expected HTMLInputElement {} to have error message "error" but it is "err"',
      actual: 'err',
      expected: 'error',
      hint: 'unexpectedMessage',
      meta: {
        element: input,
        errorMessageId: 'id',
      },
    });
  });

  it('not.toHaveErrorMessage', () => {
    expect(createInput({})).not.toHaveErrorMessage();
    expect(createInput({})).not.toHaveErrorMessage('err');

    testError(
      () =>
        expect(
          createInput({ invalid: true, errorMessageId: 'id', message: 'error' })
        ).not.toHaveErrorMessage(),
      'expected HTMLInputElement {} not to have error message'
    );

    testError(
      () =>
        expect(createInput({ invalid: true, errorMessageId: 'id', message: 'error' })).not.toHaveErrorMessage(
          'error'
        ),
      'expected HTMLInputElement {} not to have error message "error"'
    );
  });

  it('invalid type', () => {
    // @ts-expect-error
    expect(42).toHaveErrorMessage;
  });
});
