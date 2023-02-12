import expect from './index';

const Param = Symbol();

declare global {
  namespace Expect {
    export interface GenericAssertions<Actual> {
      testAssertion(param: typeof Param): void;
    }
  }
}

describe('type checking', () => {
  const test = async (cb: () => void | Promise<void>) => {
    try {
      await cb();
    } catch {}
  };

  it('same types passed to toEqual', () => {
    test(() => expect(42).toEqual(42));
    test(() => expect(42 as number).toEqual(26));
    test(() => expect<number>(42).toEqual(26));
    test(() => expect<unknown>(42).toEqual('42'));
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

  it('expect.anything()', () => {
    test(() => expect(42).toEqual(expect.anything()));
    test(() => expect({ foo: 1 }).toEqual({ foo: expect.anything() }));
  });

  it('expect.any()', () => {
    test(() => expect<boolean>(true).toEqual(expect.any(Boolean)));
    test(() => expect({ foo: 1 }).toEqual(expect.any(Object)));
    test(() => expect({ foo: 1 }).toEqual({ foo: expect.any(Number) }));

    // @ts-expect-error
    test(() => expect(1).toEqual(expect.any(String)));
    // @ts-expect-error
    test(() => expect({ foo: 1 }).toEqual({ foo: expect.any(String) }));
  });
});
