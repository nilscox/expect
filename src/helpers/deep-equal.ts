import assert from "assert";

export const deepEqual = (a: unknown, b: unknown): boolean => {
  try {
    assert.deepEqual(a, b);
    return true;
  } catch {
    return false;
  }
};
