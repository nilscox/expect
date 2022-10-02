import expect from './index';

const Param = Symbol();

declare global {
  namespace Expect {
    interface Assertions {
      testAssertion(param: typeof Param): void;
    }
  }
}

describe('type checking', () => {
  const test = (cb: () => void) => {
    try {
      cb();
    } catch {}
  };

  it('same types passed to toEqual', () => {
    test(() => expect(42).toEqual(26));
    test(() => expect([42]).toEqual([42]));
  });

  it('different types passed to toEqual', () => {
    // @ts-expect-error
    test(() => expect(42).toEqual('42'));
  });

  it('custom assertion', () => {
    test(() => expect(42).testAssertion(Param));
  });

  it('custom assertion with invalid parameters', () => {
    // @ts-expect-error
    test(() => expect(42).testAssertion('42'));
  });

  it('async assertions', () => {
    test(() => expect.async(Promise.resolve(42)).toEqual(42));

    // @ts-expect-error
    test(() => expect.async(Promise.resolve(42)).toEqual('42'));

    // @ts-expect-error
    test(() => expect.async(42).toEqual('42'));
  });
});
