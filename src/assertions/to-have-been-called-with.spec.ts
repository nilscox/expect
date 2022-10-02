import sinon from 'sinon';

import { expect } from '../expect';

describe('toHaveBeenCalledWith', () => {
  it('spy called with given arguments', () => {
    const spy = sinon.spy();

    spy('a', 1);

    expect(spy).toHaveBeenCalledWith('a', 1);
  });
});
