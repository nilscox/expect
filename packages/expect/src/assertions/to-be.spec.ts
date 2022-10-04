import { expect } from '../expect';
import { testError } from '../test/test-error';

describe('toBe', () => {
  it('same primitive type', () => {
    expect(1).toBe(1);
  });

  it('different primitive types', () => {
    testError(() => expect(1).toBe(2), 'expected 1 to be 2');
  });

  it('same object reference', () => {
    const object = {};
    expect(object).toBe(object);
  });

  it('different object references', () => {
    testError(() => expect({}).toBe({}), 'expected [object Object] to be [object Object]');
  });

  it('not.toBe()', () => {
    expect({}).not.toBe({});
    testError(() => expect(1).not.toBe(1), 'expected 1 not to be 1');
  });

  it('documentation examples', () => {
    expect(1).toBe(1);
    testError(() => expect({}).toBe({}));

    const obj = {};
    expect(obj).toBe(obj);
  });
});
