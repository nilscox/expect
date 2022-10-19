import { expect } from '../expect';
import { testError } from '../test/test-error';

describe('toBeDefined', () => {
  it('undefined value', () => {
    expect(1).toBeDefined();
  });

  it('defined value', () => {
    testError(() => expect(undefined).toBeDefined(), {
      message: 'expected undefined to be defined',
      actual: undefined,
    });
  });

  it('not.toBeDefined()', () => {
    expect(undefined).not.toBeDefined();
    testError(() => expect(1).not.toBeDefined(), 'expected 1 not to be defined');
  });
});
