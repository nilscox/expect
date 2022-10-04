import { expect } from '../expect';
import { testError } from '../test/test-error';

describe('toBeDefined', () => {
  it('defined value', () => {
    expect(1).toBeDefined();
  });

  it('undefined value', () => {
    testError(() => expect(undefined).toBeDefined(), 'expected undefined to be defined');
  });

  it('not.toBeDefined()', () => {
    expect(undefined).not.toBeDefined();
    testError(() => expect(1).not.toBeDefined(), 'expected 1 not to be defined');
  });

  it('documentation examples', () => {
    expect(1).toBeDefined();
    testError(() => expect(undefined).toBeDefined());
  });
});
