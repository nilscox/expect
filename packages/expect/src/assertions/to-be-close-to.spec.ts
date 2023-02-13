import { expect } from '../expect';
import { testError } from '../test/test-error';

describe('toBeCloseTo', () => {
  it('number being equal to another number', () => {
    expect(1).toBeCloseTo(1);
  });

  it('number being close to another number', () => {
    expect(1.001).toBeCloseTo(1);
    expect(0.9991).toBeCloseTo(1);
    expect(0.1 + 0.2).toBeCloseTo(0.3);
  });

  it('number being not close enough to another number', () => {
    testError(() => expect(1.001001).toBeCloseTo(1), {
      message: 'expected 1.001001 to be close to 1',
      expected: 1,
      actual: 1.001001,
      meta: { strict: true, threshold: 0.001 },
    });

    testError(() => expect(0.999).toBeCloseTo(1), 'expected 0.999 to be close to 1');
  });

  it('number being close to another number with a custom threshold', () => {
    expect(2).toBeCloseTo(1, { threshold: 2 });
    expect(2).toBeCloseTo(1, { threshold: 1.01, strict: true });
  });

  it('number being not close enough to another number with a custom threshold', () => {
    testError(() => expect(2).toBeCloseTo(1, { threshold: 0.1 }), {
      message: 'expected 2 to be close to 1',
      expected: 1,
      actual: 2,
      meta: { strict: true, threshold: 0.1 },
    });
  });

  describe('strict = false', () => {
    it('number being close to another number', () => {
      expect(2).toBeCloseTo(1, { threshold: 1, strict: false });
    });

    it('number not being close to another number', () => {
      testError(() => expect(2).toBeCloseTo(0, { threshold: 1, strict: false }), {
        message: 'expected 2 to be close to 0',
        expected: 0,
        actual: 2,
        meta: { strict: false, threshold: 1 },
      });
    });
  });

  it('not.toBeCloseTo()', () => {
    expect(1).not.toBeCloseTo(2);
    testError(() => expect(1).not.toBeCloseTo(1.001), 'expected 1 not to be close to 1.001');
  });

  it('invalid type', () => {
    // @ts-expect-error
    expect('').toBeCloseTo;
  });

  it('documentation examples', () => {
    expect(0.1 + 0.2).toBeCloseTo(0.3);
    testError(() => expect(2).toBeCloseTo(3));
    testError(() => expect(2).toBeCloseTo(1, { threshold: 1 }));
    expect(2).toBeCloseTo(1, { threshold: 1, strict: false });
  });
});
