import { expect } from "../expect";
import { testError } from "../test/test-error";
import { ToBeCloseToAssertionError } from "./to-be-close-to";

describe("toBeCloseTo", () => {
  it("number being equal to another number", () => {
    expect(1).toBeCloseTo(1);
  });

  it("number being close to another number", () => {
    expect(1.001).toBeCloseTo(1);
    expect(0.9991).toBeCloseTo(1);
  });

  it("number being not close enough to another number", () => {
    testError(
      () => expect(1.001001).toBeCloseTo(1),
      new ToBeCloseToAssertionError(1.001001, 1, true),
      "expected 1.001001 to be close to 1"
    );

    testError(
      () => expect(0.999).toBeCloseTo(1),
      new ToBeCloseToAssertionError(0.999, 1, true),
      "expected 0.999 to be close to 1"
    );
  });

  it("number being close to another number with a custom threshold", () => {
    expect(2).toBeCloseTo(1, { threshold: 2 });
    expect(2).toBeCloseTo(1, { threshold: 1.01, strict: true });
  });

  it("number being not close enough to another number with a custom threshold", () => {
    testError(
      () => expect(2).toBeCloseTo(1, { threshold: 0.1 }),
      new ToBeCloseToAssertionError(2, 1, true),
      "expected 2 to be close to 1"
    );
  });

  describe("strict = false", () => {
    it("number being close to another number", () => {
      expect(2).toBeCloseTo(1, { threshold: 1, strict: false });
    });
  });
});
