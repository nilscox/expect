import assert from "assert";
import { expect } from "../expect";
import { testError } from "../test/test-error";
import { ToThrowAssertionError } from "./to-throw";

describe("toThrow", () => {
  const error = new Error("error");

  const doNothing = () => {};

  const throwError = () => {
    throw error;
  };

  it("function throwing any error", () => {
    expect(throwError).toThrow();
  });

  it("returns the thrown error", () => {
    assert.strictEqual(expect(throwError).toThrow(), error);
  });

  it("function throwing a specific error", () => {
    expect(throwError).toThrow(error);
  });

  it("function not throwing", () => {
    testError(
      () => expect(doNothing).toThrow(error),
      new ToThrowAssertionError(undefined, doNothing, error),
      "expected doNothing to throw Error: error but it did not throw"
    );
  });

  it("function throwing a different error", () => {
    const other = new Error("other");

    testError(
      () => expect(throwError).toThrow(other),
      new ToThrowAssertionError(error, throwError, other),
      "expected throwError to throw Error: other but it threw Error: error"
    );
  });
});
