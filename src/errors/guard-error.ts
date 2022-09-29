import { ExpectError } from "./expect-error";

export class GuardError<Actual> extends ExpectError {
  constructor(
    public readonly assertion: string,
    public readonly expectedType: string,
    public readonly actualType: string,
    public readonly actual: Actual
  ) {
    super(`expect(actual).${assertion}(): actual must be a ${expectedType}, got ${actualType}`);
  }
}

const createGuard = (expectedType: "boolean" | "number" | "string" | "function") => {
  return (assertion: string) => (actual: unknown) => {
    if (typeof actual !== expectedType) {
      throw new GuardError(assertion, expectedType, typeof actual, actual);
    }
  };
};

export const isBoolean = createGuard("boolean");
export const isNumber = createGuard("number");
export const isString = createGuard("string");
export const isFunction = createGuard("function");
