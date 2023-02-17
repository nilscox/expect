import { expect } from '../expect';
import { isObject } from '../utils/guards';

expect.addFormatter(isObject, function (value) {
  return this.inspect(value);
});
