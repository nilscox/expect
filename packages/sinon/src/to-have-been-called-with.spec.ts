import expect from '@nilscox/expect';
import sinon from 'sinon';

describe('toHaveBeenCalledWith', () => {
  it('spy called with given arguments', () => {
    const spy = sinon.spy();

    spy('a', 1);

    expect(spy).toHaveBeenCalledWith('a', 1);
  });
});
