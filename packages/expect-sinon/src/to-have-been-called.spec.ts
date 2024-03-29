import expect from '@nilscox/expect';
import { testError } from '@nilscox/expect/helpers/test-error';
import sinon from 'sinon';

describe('toHaveBeenCalled', () => {
  it('spy called', () => {
    const spy = sinon.spy();

    spy();

    expect(spy).toHaveBeenCalled();
  });

  it('not.toHaveBeenCalled()', () => {
    const spy = sinon.spy();

    spy('hello');
    spy('hello', 'world');

    testError(
      () => expect(spy).not.toHaveBeenCalled(),
      [
        'expected [anonymous function] not to have been called ',
        'calls:',
        '"hello"',
        '"hello", "world"',
      ].join('\n')
    );
  });
});
