import expect, { testError } from '@nilscox/expect';
import sinon from 'sinon';

import './to-have-been-called-with';

describe('toHaveBeenCalledWith', () => {
  it('spy called with no argument', () => {
    const spy = sinon.spy();

    spy();

    expect(spy).toHaveBeenCalledWith();
  });

  it('spy not called', () => {
    const spy = sinon.spy();

    testError(
      () => expect(spy).toHaveBeenCalledWith(),
      'expected [anonymous function] to have been called without argument'
    );
  });

  it('spy called with given arguments', () => {
    const spy = sinon.spy();

    spy('a');
    spy('a', 1);

    expect(spy).toHaveBeenCalledWith('a');
    expect(spy).toHaveBeenCalledWith('a', 1);
  });

  it('spy not called with given arguments', () => {
    const spy = sinon.spy();

    spy('a');

    testError(
      () => expect(spy).toHaveBeenCalledWith('a', 1),
      'expected [anonymous function] to have been called with "a", 1'
    );
  });

  it('checking if spy was called with matchers', () => {
    const spy = sinon.spy();

    spy('test');

    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/t.st/));

    testError(
      () => expect(spy).toHaveBeenCalledWith(expect.stringMatching(/taste/)),
      'expected [anonymous function] to have been called with a string matching /taste/'
    );
  });

  it('not.toHaveBeenCalledWith()', () => {
    const spy = sinon.spy();

    expect(spy).not.toHaveBeenCalledWith('a');

    spy('a');
    spy('a', 1);

    testError(
      () => expect(spy).not.toHaveBeenCalledWith('a'),
      'expected [anonymous function] not to have been called with "a"'
    );

    testError(
      () => expect(spy).not.toHaveBeenCalledWith('a', 1),
      'expected [anonymous function] not to have been called with "a", 1'
    );
  });
});
