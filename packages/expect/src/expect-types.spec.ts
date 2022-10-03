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
  const test = async (cb: () => void | Promise<void>) => {
    try {
      await cb();
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

  it('async assertions', async () => {
    test(() => expect.async(Promise.resolve(42)).toEqual(42));

    // @ts-expect-error
    test(() => expect.async(Promise.resolve(42)).toEqual('42'));

    // @ts-expect-error
    test(() => expect.async(42).toEqual('42'));

    await test(async () => {
      const err1: string = await expect.rejects(Promise.reject()).with('');
      err1;

      const err2: string = await expect.rejects(Promise.reject()).with(expect.stringMatching(/$/));
      err2;

      // @ts-expect-error
      const err3: number = await expect.rejects(Promise.reject()).with('');
      err3;

      class TestError extends Error {}
      const error = new TestError('nope');

      const err4: TestError = await expect.rejects(Promise.reject(error)).with(TestError);
      err4;
    });
  });

  it('expect.anything()', () => {
    test(() => expect(42).toEqual(expect.anything()));
    test(() => expect({ foo: 1 }).toEqual({ foo: expect.anything() }));
  });

  it('expect.any()', () => {
    test(() => expect(true).toEqual(expect.any(Boolean)));
    test(() => expect({ foo: 1 }).toEqual(expect.any(Object)));
    test(() => expect({ foo: 1 }).toEqual({ foo: expect.any(Number) }));

    // @ts-expect-error
    test(() => expect(1).toEqual(expect.any(String)));
    // @ts-expect-error
    test(() => expect({ foo: 1 }).toEqual({ foo: expect.any(String) }));
  });
});
