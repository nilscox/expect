import expect from '@nilscox/expect';
import sinon from 'sinon';

import './to-have-been-called';

describe('toHaveBeenCalled', () => {
  it('spy called', () => {
    const spy = sinon.spy();

    spy();

    expect(spy).toHaveBeenCalled();
  });
});
