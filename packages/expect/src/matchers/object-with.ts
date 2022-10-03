import { expect } from '../expect';
import { createMatcher } from '../helpers/create-matcher';
import { mapObject } from '../helpers/map-object';

// todo: allow to create a custom matcher that throws instead of returning false
export const objectWith = createMatcher(
  <T extends object>(value: T & Record<PropertyKey, unknown>, object: T) => {
    try {
      expect(mapObject(object, (_value, key) => value[key])).toEqual(object);
      return true;
    } catch {
      return false;
    }
  }
);
