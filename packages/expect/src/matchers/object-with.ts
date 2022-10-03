import { expect } from '../expect';
import { createMatcher } from '../helpers/create-matcher';
import { mapObject } from '../helpers/map-object';

export const objectWith = createMatcher((value: object, object: object) => {
  try {
    expect(mapObject(object, (_value, key) => value[key])).toEqual(object);
    return true;
  } catch {
    return false;
  }
});
