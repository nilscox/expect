import assert from "assert";
import expect from "./index";

describe("async", () => {
  it("resolving promise", async () => {
    await expect(Promise.resolve(42)).toEqual(42);
  });

  it("rejecting promise", async () => {
    const error = new Error("error");

    try {
      await expect(Promise.reject<number>(error)).toEqual(42);
      throw new Error("expect did not throw");
    } catch (caught) {
      assert.strictEqual(caught, error);
    }
  });
});
