import expect from './index';

const Param = Symbol();

declare global {
  namespace Expect {
    export interface Assertions {
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

    class TestError extends Error {}
    const error = new TestError('nope');

    const result: Promise<TestError> = expect.rejects(Promise.reject(error)).with(TestError);
    result;
  });

  it('expect.anything()', () => {
    test(() => expect(1).toEqual(expect.anything()));
    test(() => expect('').toEqual(expect.anything()));
    test(() => expect({}).toEqual(expect.anything()));
    test(() => expect(() => {}).toEqual(expect.anything()));
    test(() => expect({ foo: 1 }).toEqual({ foo: expect.anything() }));
  });

  it('expect.any()', () => {
    test(() => expect('').toEqual(expect.any(String)));
    test(() => expect(1).toEqual(expect.any(Number)));
    test(() => expect(BigInt(1)).toEqual(expect.any(BigInt)));
    test(() => expect(true).toEqual(expect.any(Boolean)));
    test(() => expect(Symbol()).toEqual(expect.any(Symbol)));
    test(() => expect(() => {}).toEqual(expect.any(Function)));
    test(() => expect({ foo: 1 }).toEqual(expect.any(Object)));
    test(() => expect({ foo: 1 }).toEqual({ foo: expect.any(Number) }));

    // @ts-expect-error
    test(() => expect(1).toEqual(expect.any(String)));
    // @ts-expect-error
    test(() => expect({ foo: 1 }).toEqual({ foo: expect.any(String) }));
  });
});
