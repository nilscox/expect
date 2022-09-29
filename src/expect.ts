import assert from "assert";

export class AssertionError extends Error {
  constructor(
    public readonly assertion: string,
    public readonly actual: unknown,
    public readonly expected: unknown
  ) {
    super("assertion error");
  }
}

const areEqual = (a: unknown, b: unknown): boolean => {
  try {
    assert.deepEqual(a, b);
    return true;
  } catch {
    return false;
  }
};

interface GenericAssertions<T> {
  toBe(expected: T): void;
  toEqual(expected: T): void;
  toHaveProperty(property: string, value?: string): void;
}

interface NumberAssertions {
  toBeLessThan(value: number, options?: { strict?: boolean }): void;
  toBeMoreThan(value: number, options?: { strict?: boolean }): void;
  toBeCloseTo(value: number, options?: { threshold?: number; strict?: boolean }): void;
}

interface StringAssertions {
  toMatch(expected: RegExp): void;
}

interface FunctionAssertions {
  toThrow(expected: unknown): void;
}

export type Assertions<T> = GenericAssertions<T> & NumberAssertions & StringAssertions & FunctionAssertions;

export function expect<T extends Omit<any, number | string>>(actual: T): GenericAssertions<T>;
export function expect<T extends number>(actual: T): GenericAssertions<T> & NumberAssertions;
export function expect<T extends string>(actual: T): GenericAssertions<T> & StringAssertions;
export function expect<T extends Function>(actual: T): GenericAssertions<T> & FunctionAssertions;

export function expect<T>(actual: T): Assertions<T> {
  return {
    toBe(expected) {
      if (!Object.is(actual, expected)) {
        throw new AssertionError("toBe", actual, expected);
      }
    },

    toEqual(expected) {
      if (!areEqual(actual, expected)) {
        throw new AssertionError("toEqual", actual, expected);
      }
    },

    toHaveProperty(expected, value) {
      if (!Object.getOwnPropertyNames(actual).includes(expected)) {
        throw new AssertionError("toHaveProperty", actual, expected);
      }

      if (value !== undefined && (actual as Record<PropertyKey, unknown>)[expected] !== value) {
        throw new AssertionError("toHaveProperty", actual, expected);
      }
    },

    toBeLessThan(value: number, { strict = true } = {}) {
      if (actual > value || (strict && actual == value)) {
        throw new AssertionError("toBeLessThan", actual, value);
      }
    },

    toBeMoreThan(value: number, { strict = true } = {}) {
      if (actual < value || (strict && actual == value)) {
        throw new AssertionError("toBeMoreThan", actual, value);
      }
    },

    toBeCloseTo(value: number, { threshold = 0.001, strict = true } = {}) {
      if (typeof actual !== "number") {
        throw new Error("expect(actual).toBeCloseTo(): actual must be a number, got " + typeof actual);
      }

      const delta = Math.abs(actual - value);

      if (delta > threshold || (strict && delta == threshold)) {
        throw new AssertionError("toBeCloseTo", actual, value);
      }
    },

    toMatch(expected: RegExp) {
      if (typeof actual !== "string") {
        throw new Error("expect(actual).toMatch(): actual must be a string, got " + typeof actual);
      }

      if (!expected.exec(actual)) {
        throw new AssertionError("toMatch", actual, expected);
      }
    },

    toThrow(expected) {
      if (typeof actual !== "function") {
        throw new Error("expect(actual).toThrow(): actual must be a function, got " + typeof actual);
      }

      let error: Error | undefined = undefined;

      try {
        actual();
        error = new AssertionError("toThrow", undefined, expected);
      } catch (actual) {
        if (!areEqual(expected, actual)) {
          error = new AssertionError("toThrow", actual, expected);
        }
      }

      if (error) {
        throw error;
      }
    },
  };
}
