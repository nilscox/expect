import assert from "assert";
import { mapObject } from "./map-object";

describe("mapObject", () => {
  it("transforms an object to another of the same shape", () => {
    const input = { foo: 1 };
    const output = { foo: 2 };
    const map = (value: number) => value + 1;

    assert.deepStrictEqual(mapObject(input, map), output);
  });

  it("transforms an object to another of different shape", () => {
    const input = {
      foo: () => 1,
      bar: () => 2,
    };

    const output = {
      foo: "foo 1 0",
      bar: "bar 2 1",
    };

    const result = mapObject(input, (value, key, idx) => [key, value(), idx].join(" "));

    assert.deepStrictEqual(result, output);
  });
});
