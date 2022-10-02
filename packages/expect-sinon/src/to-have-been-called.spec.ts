import expect from '@nilscox/expect';
import { testError } from '@nilscox/expect/src/test/test-error';
import sinon from 'sinon';

import './to-have-been-called';

describe('toHaveBeenCalled', () => {
  it('spy called', () => {
    const spy = sinon.spy();

    spy();

    expect(spy).toHaveBeenCalled();
  });

  it('not.toHaveBeenCalled()', () => {
    const spy = sinon.spy();

    spy();

    testError(() => expect(spy).not.toHaveBeenCalled(), 'expected function not to have been called');
  });
});
