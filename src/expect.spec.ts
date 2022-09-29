import assert from "assert";

import { AssertionError, Assertions, expect } from "./expect";

const assertors = <T>(assertion: keyof Assertions<T>) => {
  const callExpect = (actual: T, expected: any, options?: any) => {
    const param = actual as Parameters<typeof expect>[0];
    const assert = expect(param) as Assertions<T>;

    assert[assertion](expected, options);
  };

  return {
    pass(actual: T, expected: any, options?: any) {
      try {
        callExpect(actual, expected, options);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    fail(
      actual: T,
      expected: any,
      options?: any,
      expectedError: Error = new AssertionError(assertion, actual, expected)
    ) {
      try {
        callExpect(actual, expected, options);
        throw new Error("expect did not throw");
      } catch (actual) {
        assert.deepEqual(expectedError, actual);
      }
    },
  };
};

before(() => {
  if (process.argv?.includes("--watch") || process.argv?.includes("-w")) {
    console.log("\x1Bc");
  }
});

describe("toBe", () => {
  const { pass, fail } = assertors("toBe");

  it("passes", () => {
    const obj = {};

    pass(1, 1);
    pass(obj, obj);
  });

  it("fails", () => {
    const a = {};
    const b = {};

    fail(1, 2);
    fail(a, b);
  });
});

describe("toEqual", () => {
  const { pass, fail } = assertors("toEqual");

  it("passes", () => {
    const obj = {};

    pass(1, 1);
    pass(obj, obj);
    pass({}, {});
    pass({ a: 1, b: ["foo"] }, { a: 1, b: ["foo"] });
  });

  it("fails", () => {
    fail(1, 2);
    fail({ a: 1 }, {});
    fail({}, { a: 1 });
  });
});

describe("toHaveProperty", () => {
  const { pass, fail } = assertors("toHaveProperty");

  it("passes", () => {
    pass({ foo: 1 }, "foo");
    pass({ foo: 1 }, "foo", 1);
    pass([], "length", 0);
  });

  it("fails", () => {
    fail({}, "foo");
    fail(1, "foo");
    fail([], "length", 2);
  });
});

describe("toBeLessThan", () => {
  const { pass, fail } = assertors("toBeLessThan");

  it("passes", () => {
    pass(1, 2);
    pass(1, 2, { strict: false });
    pass(1, 2, { strict: true });

    pass(1, 1, { strict: false });
  });

  it("fails", () => {
    fail(2, 1);
    fail(2, 1, { strict: false });
    fail(2, 1, { strict: true });

    fail(1, 1);
    fail(1, 1, { strict: true });
  });
});

describe("toBeMoreThan", () => {
  const { pass, fail } = assertors("toBeMoreThan");

  it("passes", () => {
    pass(2, 1);
    pass(2, 1, { strict: false });
    pass(2, 1, { strict: true });

    pass(1, 1, { strict: false });
  });

  it("fails", () => {
    fail(1, 2);
    fail(1, 2, { strict: false });
    fail(1, 2, { strict: true });

    fail(1, 1);
    fail(1, 1, { strict: true });
  });
});

describe("toBeCloseTo", () => {
  const { pass, fail } = assertors("toBeCloseTo");

  it("passes", () => {
    pass(1, 1);
    pass(1.001, 1);
    pass(2, 1, { threshold: 2 });
    pass(2, 1, { threshold: 1, strict: false });
    pass(0.001, 1, { threshold: 1, strict: true });
  });

  it("fails", () => {
    fail(2, 1);
    fail(1.01, 1);
    fail(2, 1, { threshold: 1 });
    fail(0, 1, { threshold: 1, strict: true });
  });
});

describe("toMatch", () => {
  const { pass, fail } = assertors("toMatch");

  it("passes", () => {
    pass("test", /t.st/);
  });

  it("fails", () => {
    fail("chaton", /t.st/);
  });

  it("invalid parameter", () => {
    fail(42, /t.st/, undefined, new Error("expect(actual).toMatch(): actual must be a string, got number"));
  });
});

describe("toThrow", () => {
  const { pass, fail } = assertors("toThrow");
  const error = new Error("error");

  it("passes", () => {
    pass(() => {
      throw error;
    }, error);
  });

  it("fails", () => {
    fail(() => {}, error, undefined, new AssertionError("toThrow", undefined, error));

    const nope = new Error("nope");

    fail(
      () => {
        throw nope;
      },
      error,
      undefined,
      new AssertionError("toThrow", nope, error)
    );
  });
});
