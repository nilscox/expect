import assert from "assert";
import { get } from "./get";

describe("get", () => {
  it("retrieves the object's value for a specific key", () => {
    assert.equal(get({ value: 51 }, "value"), 51);
  });

  it("retrieves the object's nested value for a specific path", () => {
    assert.equal(get({ nested: { value: 51 } }, "nested.value"), 51);
  });

  it("returns undefined when the path does not match the object", () => {
    assert.equal(get(undefined, "value"), undefined);
    assert.equal(get({ nested: 51 }, "nested.value"), undefined);
    assert.equal(get({ nested: { nope: 51 } }, "nested.value"), undefined);
    assert.equal(get({ nope: { value: 51 } }, "nested.value"), undefined);
  });
});
