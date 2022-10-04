import expect from '@nilscox/expect';
import { testError } from '@nilscox/expect/src/test/test-error';

import './to-be-disabled';

describe('toBeDisabled', () => {
  const createButton = (disabled = false) => {
    const button = document.createElement('button');

    button.disabled = disabled;

    return button;
  };

  it('disabled button', () => {
    expect(createButton(true)).toBeDisabled();
  });

  it('not disabled button', () => {
    testError(
      () => expect(createButton()).toBeDisabled(),
      'expected [object HTMLButtonElement] to be disabled'
    );
  });

  it('not.toBeDisabled', () => {
    expect(createButton()).not.toBeDisabled();

    testError(
      () => expect(createButton(true)).not.toBeDisabled(),
      'expected [object HTMLButtonElement] not to be disabled'
    );
  });
});
