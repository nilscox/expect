import expect from "./index";

interface LengthAssertions {
  toHaveLength(length: number): void;
}

declare global {
  namespace Expect {
    interface ExpectFunction {
      <Actual extends { length: number }>(actual: Actual): Extended<
        Actual,
        StringAssertions & FunctionAssertions & LengthAssertions
      >;
    }
  }
}

describe("type checking", () => {
  const test = (cb: () => void) => {
    try {
      cb();
    } catch {}
  };

  it("same number passed to toEqual", () => {
    test(() => expect(42).toEqual(42));
  });

  it("different numbers cast as number passed to toEqual", () => {
    test(() => expect(42 as number).toEqual(26));
    test(() => expect<number>(42).toEqual(26));
  });

  it("same array passed to toEqual", () => {
    test(() => expect([42]).toEqual([42]));
  });

  it("custom assertion with custom expect overload", () => {
    test(() => expect([]).toHaveLength(0));
    test(() => expect("a").toHaveLength(1));
    test(() => expect({ length: 2 }).toHaveLength(2));
    test(() => expect({} as any).toHaveLength(2));
  });

  it("non-matching type cast as any", () => {
    test(() => expect({} as any).toHaveLength(2));
  });

  it("different numbers passed to toEqual", () => {
    // @ts-expect-error
    test(() => expect(42).toEqual(40));
  });

  it("number passed to toMatch", () => {
    // @ts-expect-error
    test(() => expect(42).toMatch(/toto/));
  });

  it("invalid value passed to toHaveLength", () => {
    // @ts-expect-error
    test(() => expect(0).toHaveLength(0));
    // @ts-expect-error
    test(() => expect({}).toHaveLength(0));
  });
});
