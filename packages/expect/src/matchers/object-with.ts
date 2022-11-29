import { expect } from '../expect';
import { createMatcher } from '../helpers/create-matcher';
import { mapObject } from '../helpers/map-object';

// todo: allow to create a custom matcher that throws instead of returning false
export const objectWith = createMatcher(
  (value: any, object: object) => {
    try {
      expect(mapObject(object, (_value, key) => value[key])).toEqual(object);
      return true;
    } catch {
      return false;
    }
  },
  (object) => {
    return `an object with ${JSON.stringify(object)}`;
  }
);
