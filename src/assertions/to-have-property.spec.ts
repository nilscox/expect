import { expect } from "../expect";
import { testError } from "../test/test-error";
import { ToHavePropertyAssertionError } from "./to-have-property";

describe("toHaveProperty", () => {
  it("object having the property", () => {
    expect({ foo: 1 }).toHaveProperty("foo");
  });

  it("object not having the property", () => {
    testError(
      () => expect({ foo: 1 }).toHaveProperty("bar"),
      new ToHavePropertyAssertionError({ foo: 1 }, "bar", undefined),
      'expected [object Object] to have property "bar"'
    );
  });

  it("object having the property with a given value", () => {
    expect({ foo: 1 }).toHaveProperty("foo", 1);
  });

  it("object having the property but without the given value", () => {
    testError(
      () => expect({ foo: 1 }).toHaveProperty("foo", 2),
      new ToHavePropertyAssertionError({ foo: 1 }, "foo", 2),
      'expected [object Object] to have property "foo" = 2'
    );
  });

  it("array having the length property to a given value", () => {
    expect([]).toHaveProperty("length", 0);
  });

  it("array having the length property with a different value", () => {
    testError(
      () => expect([]).toHaveProperty("length", 1),
      new ToHavePropertyAssertionError([], "length", 1),
      'expected  to have property "length" = 1'
    );
  });
});
