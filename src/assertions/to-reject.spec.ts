import assert from "assert";
import { expect } from "../expect";
import { testErrorAsync } from "../test/test-error";
import { ToRejectAssertionError } from "./to-reject";

describe("toReject", () => {
  it("rejecting promise", async () => {
    await expect(Promise.reject()).toReject();
  });

  it("promise resolving with undefined", async () => {
    await testErrorAsync(
      expect(Promise.resolve()).toReject(),
      new ToRejectAssertionError(undefined, undefined, undefined),
      "expected promise to reject but it resolved with undefined"
    );
  });

  it("promise resolving with a value", async () => {
    await testErrorAsync(
      expect(Promise.resolve(42)).toReject(),
      new ToRejectAssertionError(undefined, undefined, 42),
      "expected promise to reject but it resolved with 42"
    );
  });

  it("returns the rejected value", async () => {
    assert.equal(await expect(Promise.reject("error")).toReject(), "error");
  });

  class TestError extends Error {}

  it("checks the rejected value instance type", async () => {
    await expect(Promise.reject<void>(new TestError())).toReject(TestError);
  });

  it("checks the rejected value inherited instance type", async () => {
    await expect(Promise.reject<void>(new TestError())).toReject(Error);
  });

  it("fails when the rejected value instance type is incorrect", async () => {
    const error = new Error("error");

    await testErrorAsync(
      expect(Promise.reject<void>(error)).toReject(TestError),
      new ToRejectAssertionError(error, TestError, undefined),
      "expected promise to reject with an instance of TestError but it rejected with Error: error"
    );
  });

  it("returns a value of the same type passed to toReject", async () => {
    try {
      // @ts-expect-error todo
      const error: Error = await expect(Promise.reject()).toReject(Error);
      error;
    } catch {}
  });
});
